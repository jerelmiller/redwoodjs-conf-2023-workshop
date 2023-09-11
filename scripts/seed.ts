import fs from 'node:fs'
import path from 'node:path'

import type { Prisma, Image as PrismaImage } from '@prisma/client'
import { db } from 'api/src/lib/db'
import toml from 'toml'

import type {
  AlbumWithRefs,
  Reference,
  PlaylistWithRefs,
  Spotify,
  SpotifyRecordWithRefs,
  TrackWithRefs,
} from './shared/types'

interface WorkshopConfig {
  user: {
    displayName: string
  }
}

const getPathFromRelative = (relativePath: string) =>
  path.resolve(__dirname, relativePath)

const readFile = (relativePath: string) => {
  return fs.readFileSync(getPathFromRelative(relativePath), 'utf8')
}

const config: WorkshopConfig = toml.parse(readFile('../workshop.config.toml'))
const refs = JSON.parse(readFile('./spotify.json'))

const getRecordFromRef = <T>(ref: Reference) => {
  return refs[ref.__ref] as T
}

const saveRecord = async (record: SpotifyRecordWithRefs) => {
  switch (record.type) {
    case 'artist':
      return saveArtist(record)
    case 'album':
      return saveAlbum(record)
    case 'playlist':
      return savePlaylist(record)
    case 'track':
      return saveTrack(record)
  }
}

const saveImage = (image: Spotify.Object.Image) => {
  return db.image.upsert({
    where: { url: image.url },
    create: image,
    update: image,
  })
}

const saveArtist = async (artist: Spotify.Object.Artist) => {
  const images: Prisma.ImageCreateOrConnectWithoutArtistsInput[] = []
  for (const img of artist.images) {
    const image = await saveImage(img)

    images.push({
      where: { id: image.id, url: image.url },
      create: {
        url: image.url,
      },
    })
  }

  return db.artist.upsert({
    where: {
      id: artist.id,
    },
    create: {
      id: artist.id,
      name: artist.name,
      followerCount: artist.followers.total,
      images: {
        connectOrCreate: images,
      },
    },
    update: {
      name: artist.name,
      followerCount: artist.followers.total,
      images: {
        connectOrCreate: images,
      },
    },
  })
}

const saveAlbum = async (album: AlbumWithRefs) => {
  const artists: Prisma.ArtistWhereUniqueInput[] = []

  for (const ref of album.artists) {
    const artist = await saveArtist(
      getRecordFromRef<Spotify.Object.Artist>(ref)
    )

    artists.push({ id: artist.id })
  }

  return db.album.upsert({
    where: { id: album.id },
    create: {
      id: album.id,
      name: album.name,
      artists: {
        connect: artists,
      },
    },
    update: {
      name: album.name,
      artists: {
        connect: artists,
      },
    },
  })
}

const savePlaylist = async (playlist: PlaylistWithRefs) => {
  const tracks: Prisma.PlaylistTrackCreateOrConnectWithoutPlaylistInput[] = []
  const images: Prisma.ImageCreateOrConnectWithoutPlaylistsInput[] = []

  for (const img of playlist.images) {
    const image = await saveImage(img)

    images.push({
      where: { id: image.id, url: image.url },
      create: { id: image.id, url: image.url },
    })
  }

  for (const playlistTrack of playlist.tracks.items) {
    const track = await saveTrack(
      getRecordFromRef<TrackWithRefs>(playlistTrack.track)
    )

    tracks.push({
      where: {
        playlistId_trackId: { playlistId: playlist.id, trackId: track.id },
      },
      create: {
        addedAt: new Date(playlistTrack.added_at),
        track: {
          connect: { id: track.id },
        },
      },
    })
  }

  return db.playlist.upsert({
    where: { id: playlist.id },
    create: {
      id: playlist.id,
      name: playlist.name,
      images: {
        connectOrCreate: images,
      },
      tracks: {
        connectOrCreate: tracks,
      },
      owner: {
        connect: {
          displayName: config.user.displayName,
        },
      },
    },
    update: {
      name: playlist.name,
      images: {
        connectOrCreate: images,
      },
      tracks: {
        connectOrCreate: tracks,
      },
    },
  })
}

const saveTrack = async (track: TrackWithRefs) => {
  const album = await saveAlbum(getRecordFromRef<AlbumWithRefs>(track.album))
  const artists: Prisma.ArtistWhereUniqueInput[] = []

  for (const ref of track.artists) {
    const artist = await saveArtist(
      getRecordFromRef<Spotify.Object.Artist>(ref)
    )

    artists.push({ id: artist.id })
  }

  return db.track.upsert({
    where: { id: track.id },
    create: {
      id: track.id,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      name: track.name,
      popularity: track.popularity,
      trackNumber: track.track_number,
      album: {
        connect: {
          id: album.id,
        },
      },
      artists: {
        connect: artists,
      },
    },
    update: {
      durationMs: track.duration_ms,
      explicit: track.explicit,
      name: track.name,
      popularity: track.popularity,
      trackNumber: track.track_number,
      album: {
        connect: {
          id: album.id,
        },
      },
      artists: {
        connect: artists,
      },
    },
  })
}

const saveUser = (user: { displayName: string; images: PrismaImage[] }) => {
  return db.user.upsert({
    where: { displayName: user.displayName ?? undefined },
    create: {
      displayName: user.displayName,
      images: {
        connect: user.images.map((image) => ({ id: image.id })),
      },
    },
    update: {
      images: {
        connect: user.images.map((image) => ({ id: image.id })),
      },
    },
  })
}

const resetUserImage = () => {
  return db.image.deleteMany({
    where: { url: { in: ['/avatar.png', '/defaultAvatar.png'] } },
  })
}

export default async () => {
  await resetUserImage()
  const avatarExists = fs.existsSync(
    getPathFromRelative('../web/public/avatar.png')
  )

  const image = await saveImage({
    url: avatarExists ? '/avatar.png' : '/defaultAvatar.png',
    height: null,
    width: null,
  })

  await saveUser({ ...config.user, images: [image] })

  for (const record of Object.values(refs)) {
    await saveRecord(record as SpotifyRecordWithRefs)
  }
}

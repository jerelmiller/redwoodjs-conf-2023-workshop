import fs from 'node:fs'
import path from 'node:path'

import { Prisma, Image as PrismaImage } from '@prisma/client'
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

const saveArtist = async (artist: Spotify.Object.Artist) => {
  const images =
    artist.images.map<Prisma.ArtistImageCreateOrConnectWithoutArtistInput>(
      (image) => ({
        where: { url: image.url },
        create: {
          url: image.url,
          height: image.height,
          width: image.height,
        },
      })
    )

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
  const images =
    album.images.map<Prisma.AlbumImageCreateOrConnectWithoutAlbumInput>(
      (image) => ({
        where: { url: image.url },
        create: {
          url: image.url,
          height: image.height,
          width: image.height,
        },
      })
    )

  for (const ref of album.artists) {
    const artist = await saveArtist(
      getRecordFromRef<Spotify.Object.Artist>(ref)
    )

    artists.push({ id: artist.id })
  }

  const copyrights =
    album.copyrights.map<Prisma.CopyrightCreateOrConnectWithoutAlbumInput>(
      (copyright) => ({
        where: {
          albumId_text_type: {
            albumId: album.id,
            text: copyright.text,
            type: copyright.type,
          },
        },
        create: copyright,
      })
    )

  return db.album.upsert({
    where: { id: album.id },
    create: {
      id: album.id,
      name: album.name,
      albumType: album.album_type,
      releaseDate: album.release_date,
      releaseDatePrecision: album.release_date_precision,
      artists: {
        connect: artists,
      },
      copyrights: {
        connectOrCreate: copyrights,
      },
      images: {
        connectOrCreate: images,
      },
    },
    update: {
      albumType: album.album_type,
      name: album.name,
      releaseDate: album.release_date,
      releaseDatePrecision: album.release_date_precision,
      artists: {
        connect: artists,
      },
      copyrights: {
        connectOrCreate: copyrights,
      },
      images: {
        connectOrCreate: images,
      },
    },
  })
}

const savePlaylist = async (playlist: PlaylistWithRefs) => {
  const tracks: Prisma.PlaylistTrackCreateOrConnectWithoutPlaylistInput[] = []
  const images =
    playlist.images.map<Prisma.PlaylistImageCreateOrConnectWithoutPlaylistInput>(
      (image) => ({
        where: { url: image.url },
        create: {
          url: image.url,
          height: image.height,
          width: image.height,
        },
      })
    )

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
        addedBy: {
          connect: {
            displayName: config.user.displayName,
          },
        },
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
      owner: {
        connect: {
          displayName: config.user.displayName,
        },
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
      discNumber: track.disc_number,
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
  const images =
    user.images.map<Prisma.UserImageCreateOrConnectWithoutUserInput>(
      (image) => ({
        where: { url: image.url },
        create: {
          url: image.url,
          height: image.height,
          width: image.height,
        },
      })
    )

  return db.user.upsert({
    where: { displayName: user.displayName ?? undefined },
    create: {
      displayName: user.displayName,
      images: {
        connectOrCreate: images,
      },
    },
    update: {
      images: {
        connectOrCreate: images,
      },
    },
  })
}

const resetUserImage = () => {
  return db.userImage.deleteMany({
    where: { url: { in: ['/avatar.png', '/defaultAvatar.png'] } },
  })
}

const removeOldUsers = async () => {
  await db.user.deleteMany({
    where: { displayName: { not: config.user.displayName } },
  })
}

export default async () => {
  await resetUserImage()
  const avatarExists = fs.existsSync(
    getPathFromRelative('../web/public/avatar.png')
  )

  await saveUser({
    ...config.user,
    images: [{ url: avatarExists ? '/avatar.png' : '/defaultAvatar.png' }],
  })

  for (const record of Object.values(refs)) {
    await saveRecord(record as SpotifyRecordWithRefs)
  }

  await removeOldUsers()
}

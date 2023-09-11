import fs from 'node:fs'
import path from 'node:path'

import type { Prisma } from '@prisma/client'
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

const readFile = (relativePath: string) => {
  return fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8')
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
  const images = artist.images.map((image) => {
    return {
      where: {
        artistId_imageUrl: { artistId: artist.id, imageUrl: image.url },
      },
      create: {
        image: {
          connectOrCreate: {
            where: { url: image.url },
            create: {
              url: image.url,
              height: image.height,
              width: image.width,
            },
          },
        },
      },
    }
  })

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

const saveUser = (user: Prisma.UserCreateWithoutPlaylistsInput) => {
  return db.user.upsert({
    where: { displayName: user.displayName },
    create: {
      displayName: user.displayName,
    },
    update: {},
  })
}

export default async () => {
  await saveUser(config.user)

  for (const record of Object.values(refs)) {
    await saveRecord(record as SpotifyRecordWithRefs)
  }
}

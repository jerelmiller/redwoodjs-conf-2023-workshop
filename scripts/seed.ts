import fs from 'node:fs'
import path from 'node:path'

import { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import toml from 'toml'

import type { Spotify, SpotifyRecord, WorkshopConfig } from './shared/types'

const getPathFromRelative = (relativePath: string) =>
  path.resolve(__dirname, relativePath)

const readFile = (relativePath: string) => {
  return fs.readFileSync(getPathFromRelative(relativePath), 'utf8')
}

const getStoreKey = (record: { type: string; id: string }) => {
  return [record.type, record.id].join(':')
}

const config: WorkshopConfig = toml.parse(readFile('../workshop.config.toml'))
const refs = JSON.parse(readFile('./spotify.json')) as Record<
  string,
  SpotifyRecord
>

const isShallowRecord = (
  simplified:
    | Spotify.Object.AlbumSimplified
    | Spotify.Object.ArtistSimplified
    | Spotify.Object.Track
    | Spotify.Object.TrackSimplified
) => {
  return !refs[getStoreKey(simplified)]
}

const getFullRecord = <
  TSimplified extends
    | Spotify.Object.ArtistSimplified
    | Spotify.Object.AlbumSimplified
>(
  simplified: TSimplified
): TSimplified extends Spotify.Object.ArtistSimplified
  ? Spotify.Object.Artist
  : TSimplified extends Spotify.Object.AlbumSimplified
  ? Spotify.Object.Album
  : unknown => {
  return (refs[getStoreKey(simplified)] || simplified) as never
}

const saveRecord = async (record: SpotifyRecord) => {
  switch (record.type) {
    case 'artist':
      return saveArtist(record)
    case 'album':
      for (const artist of record.artists) {
        await saveArtist(artist)
      }
      return saveAlbum(record)
    case 'playlist':
      return savePlaylist(record)
    case 'track':
      for (const artist of record.artists.concat(record.album.artists)) {
        await saveArtist(artist)
      }
      await saveAlbum(record.album)
      return saveTrack(record, record.album.id)
  }
}

const saveArtist = async (
  artist: Spotify.Object.Artist | Spotify.Object.ArtistSimplified
) => {
  artist = getFullRecord(artist)
  const images: Prisma.ArtistImageCreateOrConnectWithoutArtistInput[] = []
  const followerCount = 'followers' in artist ? artist.followers.total : 0

  if ('images' in artist) {
    for (const image of artist.images) {
      images.push({
        where: { url: image.url },
        create: {
          url: image.url,
          height: image.height,
          width: image.height,
        },
      })
    }
  }

  return db.artist.upsert({
    where: {
      id: artist.id,
    },
    create: {
      id: artist.id,
      name: artist.name,
      followerCount,
      shallow: isShallowRecord(artist),
      images: {
        connectOrCreate: images,
      },
    },
    update: {
      name: artist.name,
      followerCount,
      shallow: isShallowRecord(artist),
      images: {
        connectOrCreate: images,
      },
    },
  })
}

const saveAlbum = async (
  album: Spotify.Object.Album | Spotify.Object.AlbumSimplified
) => {
  album = getFullRecord(album)
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

  const artists = album.artists.map<Prisma.ArtistWhereUniqueInput>(
    (artist) => ({ id: artist.id })
  )

  const copyrights: Prisma.CopyrightCreateOrConnectWithoutAlbumInput[] = []

  if ('copyrights' in album) {
    for (const copyright of album.copyrights) {
      copyrights.push({
        where: {
          albumId_text_type: {
            albumId: album.id,
            text: copyright.text,
            type: copyright.type,
          },
        },
        create: copyright,
      })
    }
  }

  const savedAlbum = await db.album.upsert({
    where: { id: album.id },
    create: {
      id: album.id,
      name: album.name,
      albumType: album.album_type,
      releaseDate: album.release_date,
      releaseDatePrecision: album.release_date_precision,
      shallow: isShallowRecord(album),
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
      shallow: isShallowRecord(album),
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

  if ('tracks' in album) {
    for (const track of album.tracks.items) {
      for (const artist of track.artists) {
        await saveArtist(artist)
      }

      await saveTrack(track, album.id)
    }
  }

  return savedAlbum
}

const savePlaylist = async (playlist: Spotify.Object.Playlist) => {
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

  const createdPlaylist = await db.playlist.upsert({
    where: { id: playlist.id },
    create: {
      id: playlist.id,
      name: playlist.name,
      images: {
        connectOrCreate: images,
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
      owner: {
        connect: {
          displayName: config.user.displayName,
        },
      },
    },
  })

  for (const playlistTrack of playlist.tracks.items) {
    for (const artist of playlistTrack.track.artists.concat(
      playlistTrack.track.album.artists
    )) {
      await saveArtist(artist)
    }
    await saveAlbum(playlistTrack.track.album)
    const track = await saveTrack(
      playlistTrack.track,
      playlistTrack.track.album.id
    )

    await db.playlistTrack.upsert({
      where: {
        playlistId_trackId: {
          playlistId: createdPlaylist.id,
          trackId: track.id,
        },
      },
      create: {
        addedAt: new Date(playlistTrack.added_at),
        addedBy: {
          connect: {
            displayName: config.user.displayName,
          },
        },
        playlist: {
          connect: {
            id: createdPlaylist.id,
          },
        },
        track: {
          connect: {
            id: track.id,
          },
        },
      },
      update: {
        addedAt: new Date(playlistTrack.added_at),
        addedBy: {
          connect: {
            displayName: config.user.displayName,
          },
        },
      },
    })
  }

  return playlist
}

const saveTrack = async (
  track: Spotify.Object.Track | Spotify.Object.TrackSimplified,
  albumId: string
) => {
  const artists = track.artists.map<Prisma.ArtistWhereUniqueInput>(
    (artist) => ({ id: artist.id })
  )
  const popularity = 'popularity' in track ? track.popularity : 0

  return db.track.upsert({
    where: { id: track.id },
    create: {
      id: track.id,
      discNumber: track.disc_number,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      name: track.name,
      popularity: popularity,
      trackNumber: track.track_number,
      shallow: isShallowRecord(track),
      album: {
        connect: {
          id: albumId,
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
      popularity: popularity,
      trackNumber: track.track_number,
      shallow: isShallowRecord(track),
      album: {
        connect: {
          id: albumId,
        },
      },
      artists: {
        connect: artists,
      },
    },
  })
}

const saveUser = (user: {
  displayName: string
  images: Array<{ url: string; height: number | null; width: number | null }>
}) => {
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

const saveAlbumToLibrary = async (
  albumId: string,
  currentUser: { id: string }
) => {
  await db.savedAlbum.upsert({
    where: {
      albumId_userId: { albumId, userId: currentUser.id },
    },
    create: {
      album: {
        connect: { id: albumId },
      },
      user: {
        connect: { id: currentUser.id },
      },
    },
    update: {},
  })
}

const saveTrackToLibrary = async (
  trackId: string,
  currentUser: { id: string }
) => {
  await db.savedTrack.upsert({
    where: {
      trackId_userId: { trackId, userId: currentUser.id },
    },
    create: {
      track: {
        connect: { id: trackId },
      },
      user: {
        connect: { id: currentUser.id },
      },
    },
    update: {},
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

const DEVICE_TYPES = ['computer', 'mobile', 'speaker']

const saveDevice = async (currentUser: { id: string }) => {
  const name = config.device.name ?? 'My Computer'
  const type = config.device.type ?? 'computer'

  if (!DEVICE_TYPES.includes(type)) {
    throw new Error(
      `Device type '${type}' not valid. Must be one of ${DEVICE_TYPES.join(
        ', '
      )}`
    )
  }

  await db.device.deleteMany({
    where: { NOT: { name, type, userId: currentUser.id } },
  })

  await db.device.upsert({
    where: { name_type_userId: { name, type, userId: currentUser.id } },
    create: {
      name,
      type,
      volumePercent: 100,
      user: {
        connect: { id: currentUser.id },
      },
    },
    update: {},
  })
}

export default async () => {
  await resetUserImage()
  const avatarExists = fs.existsSync(
    getPathFromRelative('../web/public/avatar.png')
  )

  const currentUser = await saveUser({
    ...config.user,
    images: [
      {
        url: avatarExists ? '/avatar.png' : '/defaultAvatar.png',
        height: null,
        width: null,
      },
    ],
  })

  await saveDevice(currentUser)

  for (const record of Object.values(refs)) {
    await saveRecord(record as SpotifyRecord)
  }

  for (const id of config.spotify.saved.albumIds) {
    await saveAlbumToLibrary(id, currentUser)
  }

  for (const id of config.spotify.saved.trackIds) {
    await saveTrackToLibrary(id, currentUser)
  }

  await removeOldUsers()
}

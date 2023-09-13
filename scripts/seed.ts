import fs from 'node:fs'
import path from 'node:path'

import { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import toml from 'toml'

import type { Spotify, SpotifyRecord } from './shared/types'

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

const getStoreKey = (record: { type: string; id: string }) => {
  return [record.type, record.id].join(':')
}

const config: WorkshopConfig = toml.parse(readFile('../workshop.config.toml'))
const refs = JSON.parse(readFile('./spotify.json')) as Record<
  string,
  SpotifyRecord
>

const isShallowRecord = (
  simplified: Spotify.Object.AlbumSimplified | Spotify.Object.ArtistSimplified
) => {
  console.log({
    key: getStoreKey(simplified),
    exists: Boolean(refs[getStoreKey(simplified)]),
  })
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
      return saveAlbum(record)
    case 'playlist':
      return savePlaylist(record)
    case 'track':
      return saveTrack(record)
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
    const artist = await saveArtist(ref)

    artists.push({ id: artist.id })
  }

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

  return db.album.upsert({
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
    const track = await saveTrack(playlistTrack.track)

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

const saveTrack = async (track: Spotify.Object.Track) => {
  const album = await saveAlbum(track.album)
  const artists: Prisma.ArtistWhereUniqueInput[] = []

  for (const ref of track.artists) {
    const artist = await saveArtist(ref)

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
    images: [
      {
        url: avatarExists ? '/avatar.png' : '/defaultAvatar.png',
        height: null,
        width: null,
      },
    ],
  })

  for (const record of Object.values(refs)) {
    await saveRecord(record as SpotifyRecord)
  }

  await removeOldUsers()
}

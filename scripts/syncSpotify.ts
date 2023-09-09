/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs'
import path from 'node:path'

import { db } from 'api/src/lib/db'
import toml from 'toml'

const BASE_URI = 'https://api.spotify.com'
let accessToken!: string

interface Artist {
  id: string
  type: 'artist'
  name: string
  images: Image[]
  followers: {
    href: string | null
    total: number
  }
}

interface Album {
  id: string
  type: 'album'
  artists: Artist[]
  name: string
  tracks: {
    items: Track[]
  }
}

type AlbumWithRefs = Omit<Album, 'artists' | 'tracks'> & {
  artists: Reference[]
  tracks: { items: Reference[] }
}

interface Image {
  url: string
  height: number
  width: number
}

interface Playlist {
  id: string
  type: 'playlist'
  name: string
  tracks: {
    items: Array<{ added_at: string; track: Track }>
  }
}

type PlaylistWithRefs = Omit<Playlist, 'tracks'> & {
  tracks: {
    items: Array<
      Omit<Playlist['tracks']['items'][0], 'track'> & { track: Reference }
    >
  }
}

interface Track {
  id: string
  type: 'track'
  disc_number: number
  duration_ms: number
  explicit: boolean
  name: string
  popularity: number
  track_number: number
  album: Album
  artists: Artist[]
}

type TrackWithRefs = Omit<Track, 'album' | 'artists'> & {
  album: Reference
  artists: Reference[]
}

type SpotifyRecord = Artist | Album | Playlist | Track
type SpotifyRecordWithRefs =
  | Artist
  | AlbumWithRefs
  | PlaylistWithRefs
  | TrackWithRefs

interface Reference {
  __ref: string
}

const queue = new Map<string, Set<string>>()
const refs: Record<string, SpotifyRecordWithRefs> = {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const deepUpdate = (obj: object, value: unknown, path: string) => {
  let i: number
  const segments = path.split('.')

  for (i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj = (obj as any)[segment]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(obj as any)[segments[i]] = value
}

const mapUpdate = <TKey, TValue>(
  map: Map<TKey, TValue>,
  key: TKey,
  updater: (value: TValue) => TValue,
  defaultValue: TValue
) => {
  map.set(key, map.has(key) ? updater(map.get(key)!) : defaultValue)

  return map
}

const addToQueue = (
  record: { type: string; id: string },
  options?: { update: SpotifyRecord; withRefAtPath: string[] }
) => {
  const pathString = options
    ? [getStoreKey(options.update), ...options.withRefAtPath].join('.')
    : null

  mapUpdate(
    queue,
    getStoreKey(record),
    (set) => (pathString ? set.add(pathString) : set),
    new Set(pathString ? [pathString] : undefined)
  )
}

interface WorkshopConfig {
  user: {
    displayName: string
  }
  spotify: {
    albumIds: string[]
    trackIds: string[]
    playlistIds: string[]
  }
}

interface AccessTokenResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

const getWorkshopConfig = (): WorkshopConfig => {
  return toml.parse(
    fs.readFileSync(path.resolve(__dirname, '../workshop.config.toml'), 'utf8')
  )
}

const getRecordFromRef = <T>(ref: Reference) => {
  return refs[ref.__ref] as T
}

const authenticate = async (): Promise<AccessTokenResponse> => {
  const credentials = [
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET,
  ].join(':')

  const body = new URLSearchParams()

  body.set('grant_type', 'client_credentials')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  return res.json()
}

const getStoreKey = ({ type, id }: { type: string; id: string }) => {
  return `${type}:${id}`
}

const toReference = (record: { type: string; id: string }): Reference => {
  if (record.type == null) {
    throw new Error(
      `Record did not have type: \n ${JSON.stringify(record, null, 2)}`
    )
  }

  return { __ref: getStoreKey(record) }
}

const getArtist = async (id: string) => {
  return get<Artist>('/artists/:id', { id })
}

const getAlbum = async (id: string) => {
  return tap(await get<Album>('/albums/:id', { id }), (album) => {
    album.artists.forEach((artist, idx) => {
      addToQueue(artist, {
        update: album,
        withRefAtPath: ['artists', String(idx)],
      })
    })

    album.tracks.items.forEach((track, idx) => {
      addToQueue(track, {
        update: album,
        withRefAtPath: ['tracks', 'items', String(idx)],
      })
    })
  })
}

const getTrack = async (id: string) => {
  return tap(await get<Track>('/tracks/:id', { id }), (track) => {
    addToQueue(track.album, { update: track, withRefAtPath: ['album'] })

    track.artists.forEach((artist, idx) => {
      addToQueue(artist, {
        update: track,
        withRefAtPath: ['artists', String(idx)],
      })
    })
  })
}

const getPlaylist = async (id: string) => {
  return tap(await get<Playlist>('/playlists/:id', { id }), (playlist) => {
    playlist.tracks.items.forEach(({ track }, idx) => {
      addToQueue(track, {
        update: playlist,
        withRefAtPath: ['tracks', 'items', String(idx), 'track'],
      })
    })
  })
}

const getByStoreKey = (storeKey: string) => {
  const [type, id] = storeKey.split(':')

  switch (type) {
    case 'album':
      return getAlbum(id)
    case 'artist':
      return getArtist(id)
    case 'track':
      return getTrack(id)
    case 'playlist':
      return getPlaylist(id)
    default:
      throw new Error(`Unknown type: ${type}`)
  }
}

async function tap<T>(value: T, fn: (value: T) => void) {
  fn(value)
  return value
}

function replaceUrlParams(pathname: string, params: Record<string, string>) {
  return pathname.replace(/(?<=\/):(\w+)/g, (_, name) => {
    return params[name]
  })
}

async function get<TData = unknown>(
  pathname: string,
  params?: Record<string, string>
): Promise<TData> {
  const uri = path.join(
    BASE_URI,
    'v1',
    replaceUrlParams(pathname, params ?? {})
  )

  const res = await fetch(uri, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  console.log(`GET ${uri} ${res.status}`)

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`${res.status} ${data.error.message}`)
  }

  return data
}

const processQueue = async () => {
  for (const [key, paths] of queue) {
    refs[key] ||= (await getByStoreKey(key)) as SpotifyRecordWithRefs

    paths.forEach((path) => deepUpdate(refs, toReference(refs[key]), path))
    queue.delete(key)

    await sleep(100)
  }
}

const writeStore = async () => {
  fs.writeFileSync(
    path.resolve(__dirname, './spotify.json'),
    JSON.stringify(refs, null, 2)
  )

  for (const record of Object.values(refs)) {
    switch (record.type) {
      case 'artist':
        await saveArtist(record)
        break
      case 'album':
        await saveAlbum(record)
        break
      case 'track':
        await saveTrack(record)
        break
      case 'playlist':
        await savePlaylist(record)
    }
  }
}

const saveAlbum = async (album: AlbumWithRefs) => {
  const artists = await Promise.all(
    album.artists.map(async (ref) => {
      const artist = await saveArtist(getRecordFromRef<Artist>(ref))

      return { id: artist.id }
    })
  )

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

const saveArtist = async (artist: Artist) => {
  const images = await Promise.all(
    artist.images.map(async (img) => {
      const image = await saveImage(img)

      return {
        artistId_imageUrl: {
          artistId: artist.id,
          imageUrl: image.url,
        },
      }
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
        connect: images,
      },
    },
    update: {
      name: artist.name,
      followerCount: artist.followers.total,
      images: {
        connect: images,
      },
    },
  })
}

const savePlaylist = async (playlist: PlaylistWithRefs) => {
  const tracks = await Promise.all(
    playlist.tracks.items.map(async (playlistTrack) => {
      const track = await saveTrack(
        getRecordFromRef<TrackWithRefs>(playlistTrack.track)
      )

      return {
        where: {
          playlistId_trackId: { playlistId: playlist.id, trackId: track.id },
        },
        create: {
          addedAt: new Date(playlistTrack.added_at),
          track: {
            connect: { id: track.id },
          },
        },
      }
    })
  )
  return db.playlist.upsert({
    where: { id: playlist.id },
    create: {
      id: playlist.id,
      name: playlist.name,
      tracks: {
        connectOrCreate: tracks,
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
  const artists = await Promise.all(
    track.artists.map(async (ref) => {
      const artist = await saveArtist(getRecordFromRef<Artist>(ref))

      return { id: artist.id }
    })
  )

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

const saveImage = (image: Image) => {
  return db.image.upsert({
    where: {
      url: image.url,
    },
    create: {
      url: image.url,
      height: image.height,
      width: image.width,
    },
    update: {
      height: image.height,
      width: image.width,
    },
  })
}

export default async () => {
  const { spotify: config } = getWorkshopConfig()
  accessToken = (await authenticate()).access_token

  for (const id of config.albumIds) {
    addToQueue({ type: 'album', id })
  }

  for (const id of config.trackIds) {
    addToQueue({ type: 'track', id })
  }

  for (const id of config.playlistIds) {
    addToQueue({ type: 'playlist', id })
  }

  await processQueue()
  await writeStore()
}

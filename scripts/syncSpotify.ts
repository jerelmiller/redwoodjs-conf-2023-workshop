/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs'
import path from 'node:path'

import toml from 'toml'

import type {
  AlbumWithRefs,
  PlaylistWithRefs,
  Reference,
  Spotify,
  SpotifyRecord,
  TrackWithRefs,
} from './shared/types'

const BASE_URI = 'https://api.spotify.com'
let accessToken!: string

type SpotifyRecordWithRefs =
  | Spotify.Object.Artist
  | AlbumWithRefs
  | PlaylistWithRefs
  | TrackWithRefs

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
  return get('/artists/:id', { id })
}

const getAlbum = async (id: string) => {
  return tap(await get('/albums/:id', { id }), (album) => {
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
  return tap(await get('/tracks/:id', { id }), (track) => {
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
  return tap(await get('/playlists/:id', { id }), (playlist) => {
    const hasEpisodes = playlist.tracks.items.some(
      (item) => item.track.type === 'episode'
    )
    if (hasEpisodes) {
      throw new Error(
        'Playlists with episodes are not supported in this workshop. Please pick a playlist that only contains tracks.'
      )
    }

    playlist.tracks.items.forEach((item, idx) => {
      addToQueue(item.track, {
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

async function get<Pathname extends keyof Spotify.Response.GET>(
  pathname: Pathname,
  params?: Record<string, string>
): Promise<Spotify.Response.GET[Pathname]> {
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
    JSON.stringify(refs)
  )
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

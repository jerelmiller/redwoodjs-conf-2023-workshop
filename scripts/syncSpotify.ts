/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs'
import path from 'node:path'

import toml from 'toml'

import type {
  // AlbumWithRefs,
  // PlaylistWithRefs,
  // Reference,
  Spotify,
  SpotifyRecord,
  // TrackWithRefs,
} from './shared/types'

// type SpotifyRecordWithRefs =
//   | Spotify.Object.Artist
//   | AlbumWithRefs
//   | PlaylistWithRefs
//   | TrackWithRefs

interface BareRecord {
  id: string
  type: string
}

interface WorkshopConfig {
  user: {
    displayName: string
  }
  spotify: {
    albumIds: string[]
    playlistIds: string[]
  }
}

interface AccessTokenResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

const BASE_URI = 'https://api.spotify.com'
let accessToken!: string

const queue = new Set<string>()
const refs: Record<string, SpotifyRecord> = {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// const deepUpdate = (
//   obj: object,
//   value: unknown,
//   path: Array<string | number>
// ) => {
//   let i: number
//
//   for (i = 0; i < path.length - 1; i++) {
//     const segment = path[i]
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     obj = (obj as any)[segment]
//   }
//
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   ;(obj as any)[path[i]] = value
// }

// const mapUpdate = <TKey, TValue>(
//   map: Map<TKey, TValue>,
//   key: TKey,
//   updater: (value: TValue) => TValue,
//   defaultValue: TValue
// ) => {
//   map.set(key, map.has(key) ? updater(map.get(key)!) : defaultValue)
//
//   return map
// }

const addToQueue = (record: BareRecord) => {
  queue.add(getStoreKey(record))
}

// const addToQueue = (
//   record: BareRecord,
//   options?: { update: SpotifyRecord; withRefAtPath: string[] }
// ) => {
//   const pathString = options
//     ? [getStoreKey(options.update), ...options.withRefAtPath].join('.')
//     : null
//
//   mapUpdate(
//     queue,
//     getStoreKey(record),
//     (set) => (pathString ? set.add(pathString) : set),
//     new Set(pathString ? [pathString] : undefined)
//   )
// }

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

const getStoreKey = ({ type, id }: BareRecord) => {
  return `${type}:${id}`
}

// const toReference = (record: { type: string; id: string }): Reference => {
//   if (record.type == null) {
//     throw new Error(
//       `Record did not have type: \n ${JSON.stringify(record, null, 2)}`
//     )
//   }
//
//   return { __ref: getStoreKey(record) }
// }

// const isReference = (obj: object): obj is Reference => {
//   return '__ref' in obj && obj.__ref === 'string'
// }

const getArtist = async (id: string) => {
  return get('/artists/:id', { params: { id } })
}

const getAlbum = async (id: string) => {
  const album = await get('/albums/:id', { params: { id } })
  const tracks = await getPaginated(album.tracks)

  album.tracks.items.push(...tracks)

  return album
}

const getTrack = async (id: string) => {
  return get('/tracks/:id', { params: { id } })
}

const getPlaylist = async (id: string) => {
  const playlist = await get('/playlists/:id', { params: { id } })
  const tracks = await getPaginated(playlist.tracks)

  playlist.tracks.items.push(...tracks)

  return playlist
}

const getPaginated = async <TRecord>(
  paginated: Spotify.Object.Paginated<TRecord>
): Promise<TRecord[]> => {
  const records: TRecord[] = []
  let next = paginated.next

  while (next) {
    const data = await fetchEndpoint<Spotify.Object.Paginated<TRecord>>(next)

    next = data.next
    records.push(...data.items)
  }

  return records
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

// async function tap<T>(value: T, fn: (value: T) => void) {
//   fn(value)
//   return value
// }

function replaceUrlParams(pathname: string, params: Record<string, string>) {
  return pathname.replace(/(?<=\/):(\w+)/g, (_, name) => {
    return params[name]
  })
}

async function get<Pathname extends keyof Spotify.Response.GET>(
  pathname: Pathname,
  {
    params,
    queryParams,
  }: {
    params?: Record<string, string>
    queryParams?: Record<string, string | number>
  } = {}
): Promise<Spotify.Response.GET[Pathname]> {
  const base = path.join(
    BASE_URI,
    'v1',
    replaceUrlParams(pathname, params ?? {})
  )

  return fetchEndpoint(
    queryParams ? `${base}?${toURLSearchParams(queryParams)}` : base
  )
}

const fetchEndpoint = async <TData>(uri: string): Promise<TData> => {
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

const toURLSearchParams = (queryParams: Record<string, string | number>) => {
  return new URLSearchParams(
    Object.entries(queryParams).map(([key, value]) => [key, String(value)])
  )
}

// const replaceWithRef = (
//   record: SpotifyRecord,
//   path: Array<string | number>
// ) => {
//   const relation = path.reduce<SpotifyRecord>(
//     (memo, segment) => (memo as never)[segment],
//     record
//   )
//
//   if (isReference(relation)) {
//     return
//   }
//
//   deepUpdate(record, toReference(relation), path)
// }

const processQueue = async () => {
  for (const key of queue) {
    refs[key] ||= await getByStoreKey(key)

    queue.delete(key)

    await sleep(50)
  }
}

const writeStore = async () => {
  fs.writeFileSync(
    path.resolve(__dirname, './spotify.json'),
    JSON.stringify(refs, null, 2)
  )
}

export default async () => {
  const { spotify: config } = getWorkshopConfig()
  accessToken = (await authenticate()).access_token

  for (const id of config.albumIds) {
    addToQueue({ type: 'album', id })
  }

  for (const id of config.playlistIds) {
    addToQueue({ type: 'playlist', id })
  }

  await processQueue()
  await writeStore()
}

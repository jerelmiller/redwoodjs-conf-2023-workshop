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
    artistIds: string[]
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

const addToQueue = (
  record: BareRecord,
  { depth = 1 }: { depth?: number } = {}
) => {
  queue.add([record.type, record.id, depth].join(':'))
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

// const getStoreKey = ({ type, id }: BareRecord) => {
//   return `${type}:${id}`
// }

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
interface QueueOptions {
  depth: number
}

const getArtist = async (id: string, { depth }: QueueOptions) => {
  const artist = await get('/artists/:id', { params: { id } })
  const albums = await get('/artists/:id/albums', { params: { id } })
  const allAlbums = await getPaginated(albums)

  albums.items
    .concat(allAlbums)
    .forEach((album) => [addToQueue(album, { depth: depth + 1 })])

  return artist
}

const getAlbum = async (id: string, { depth }: QueueOptions) => {
  const album = await get('/albums/:id', { params: { id } })
  const tracks = await getPaginated(album.tracks)

  album.tracks.items.push(...tracks)
  album.tracks.items.forEach((track) => {
    addToQueue(track, { depth: depth + 1 })
  })
  album.artists.forEach((artist) => {
    addToQueue(artist, { depth: depth + 1 })
  })

  return album
}

const getTrack = async (id: string, { depth }: QueueOptions) => {
  const track = await get('/tracks/:id', { params: { id } })

  addToQueue(track.album, { depth: depth + 1 })
  track.artists.forEach((artist) => {
    addToQueue(artist, { depth: depth + 1 })
  })

  return track
}

const getPlaylist = async (id: string, { depth }: QueueOptions) => {
  const playlist = await get('/playlists/:id', {
    params: { id },
    queryParams: { additional_types: 'track' },
  })
  const tracks = await getPaginated(playlist.tracks)

  playlist.tracks.items.push(...tracks)
  playlist.tracks.items.forEach((item) => {
    addToQueue(item.track, { depth: depth + 1 })
  })

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

const getRecord = (type: string, id: string, depth: number) => {
  switch (type) {
    case 'album':
      return getAlbum(id, { depth })
    case 'artist':
      return getArtist(id, { depth })
    case 'track':
      return getTrack(id, { depth })
    case 'playlist':
      return getPlaylist(id, { depth })
    default:
      throw new Error(`Unknown type: ${type}`)
  }
}

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

const processQueue = async (maxDepth: number) => {
  for (const key of queue) {
    const [type, id, depthStr] = key.split(':')
    const depth = parseInt(depthStr, 10)

    if (depth <= maxDepth) {
      refs[key] ||= await getRecord(type, id, depth)
    }

    queue.delete(key)

    await sleep(50)
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

  for (const id of config.artistIds) {
    addToQueue({ type: 'artist', id })
  }

  for (const id of config.albumIds) {
    addToQueue({ type: 'album', id })
  }

  for (const id of config.playlistIds) {
    addToQueue({ type: 'playlist', id })
  }

  await processQueue(2)
  await writeStore()
}

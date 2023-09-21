/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs'
import path from 'node:path'

import { readConfig } from './shared/readConfig'
import type { Spotify, SpotifyRecord } from './shared/types'

const DEFAULT_SYNCED_ALBUMS = [
  '151w1FgRZfnKZA9FEcg9Z3', // Midnights - Taylor Swift
]

const DEFAULT_SYNCED_PLAYLISTS = [
  '6dct72C91vKsJtsznrCAm3', // RedwoodJS Conf 2023
]

const DEFAULT_SYNCED_ARTISTS = [
  '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
]

interface BareRecord {
  id: string
  type: string
}

interface AccessTokenResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

type QueueKey = `${string}:${string}:${number}`

interface QueueItem {
  id: string
  key: QueueKey
  type: string
  refKey: string
  depth: number
}

const BASE_URI = 'https://api.spotify.com'
let accessToken!: string
let maxDepth!: number

const queue = new Set<QueueKey>()
const refs: Record<string, SpotifyRecord> = {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const encode = (record: BareRecord, { depth }: { depth: number }): QueueKey => {
  return `${record.type}:${record.id}:${depth}`
}

const decode = (key: QueueKey): QueueItem => {
  const [type, id, depth] = key.split(':')

  return {
    type,
    key,
    id,
    depth: parseInt(depth, 10),
    refKey: [type, id].join(':'),
  }
}

const addToQueue = (record: BareRecord, { depth }: { depth: number }) => {
  queue.add(encode(record, { depth }))
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

interface QueueOptions {
  depth: number
}

const getArtists = async (items: QueueItem[]) => {
  const { artists } = await get('/artists', {
    queryParams: { ids: items.map((item) => item.id).join(',') },
  })

  for (const [idx, item] of items.entries()) {
    if (item.depth + 1 > maxDepth) {
      continue
    }

    const artist = artists[idx]

    const albums = await get('/artists/:id/albums', {
      params: { id: artist.id },
      queryParams: { include_groups: 'album,single,compilation' },
    })
    const allAlbums = await getPaginated(albums)

    albums.items
      .concat(allAlbums)
      .forEach((album) => addToQueue(album, { depth: item.depth + 1 }))
  }

  return artists
}

const getAlbums = async (items: QueueItem[]) => {
  const { albums } = await get('/albums', {
    queryParams: { ids: items.map((item) => item.id).join(',') },
  })

  for (const [idx, item] of items.entries()) {
    const album = albums[idx]

    const tracks = await getPaginated(album.tracks)

    album.tracks.items.push(...tracks)
    album.tracks.items.forEach((track) => {
      addToQueue(track, { depth: item.depth + 1 })
    })
    album.artists.forEach((artist) => {
      addToQueue(artist, { depth: item.depth + 1 })
    })
  }

  return albums
}

const getTracks = async (items: QueueItem[]) => {
  const { tracks } = await get('/tracks', {
    queryParams: { ids: items.map((item) => item.id).join(',') },
  })

  for (const [idx, item] of items.entries()) {
    const track = tracks[idx]

    addToQueue(track.album, { depth: item.depth + 1 })
    track.artists.forEach((artist) => {
      addToQueue(artist, { depth: item.depth + 1 })
    })
  }

  return tracks
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

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status}: ${text}`)
  }

  return res.json()
}

const toURLSearchParams = (queryParams: Record<string, string | number>) => {
  return new URLSearchParams(
    Object.entries(queryParams).map(([key, value]) => [key, String(value)])
  )
}

const processItem = async (key: QueueKey) => {
  const { type, id, depth, refKey } = decode(key)

  if (depth <= maxDepth) {
    // Avoid rate limiting by sleeping for a short duration
    refs[refKey] ||= (await sleep(50), await getRecord(type, id, depth))
  }

  queue.delete(key)
}

const getBatch = async (type: string, items: QueueItem[]) => {
  switch (type) {
    case 'album':
      return getAlbums(items)
    case 'artist':
      return getArtists(items)
    case 'track':
      return getTracks(items)
    default:
      throw new Error(`Unable to batch: ${type}`)
  }
}

const processBatch = async (type: string) => {
  const batchSize = BATCH_SIZES[type]
  const batch = Array.from(queue.keys())
    .map((key) => decode(key))
    .filter(
      (decoded) =>
        decoded.depth <= maxDepth &&
        decoded.type === type &&
        !refs[decoded.refKey]
    )
    .slice(0, batchSize)

  if (batch.length === 0) {
    return
  }

  await sleep(50)
  const records = await getBatch(type, batch)

  batch.forEach((item, idx) => {
    refs[item.refKey] = records[idx]
    queue.delete(item.key)
  })
}

const BATCH_SIZES: Record<string, number> = {
  album: 20,
  artist: 50,
  track: 50,
}

const isBatchable = (type: string) => {
  return type in BATCH_SIZES
}

const processQueue = async () => {
  for (const key of queue) {
    const { type } = decode(key)

    if (isBatchable(type)) {
      await processBatch(type)
    } else {
      await processItem(key)
    }
  }
}

const writeStore = () => {
  fs.writeFileSync(
    path.resolve(__dirname, './spotify.json'),
    JSON.stringify(refs)
  )
}

interface Program {
  args: {
    maxDepth?: number
  }
}

export default async ({ args }: Program) => {
  maxDepth = args.maxDepth ?? 3
  accessToken = (await authenticate()).access_token

  for (const id of DEFAULT_SYNCED_ARTISTS) {
    addToQueue({ type: 'artist', id }, { depth: 1 })
  }

  for (const id of DEFAULT_SYNCED_ALBUMS) {
    addToQueue({ type: 'album', id }, { depth: 1 })
  }

  for (const id of DEFAULT_SYNCED_PLAYLISTS) {
    addToQueue({ type: 'playlist', id }, { depth: 1 })
  }

  await processQueue()
  writeStore()
}

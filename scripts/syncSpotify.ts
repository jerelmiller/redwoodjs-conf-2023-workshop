/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs'
import path from 'node:path'

import toml from 'toml'

const BASE_URI = 'https://api.spotify.com'
let accessToken!: string

interface SpotifyRecord {
  id: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any
}

interface Reference {
  __ref: string
}

const refs: Record<string, SpotifyRecord> = {}

interface WorkshopConfig {
  user: {
    displayName: string
  }
  spotify: {
    albumIds: string[]
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

const toReference = (record: SpotifyRecord): Reference => {
  if (record.type == null) {
    throw new Error(
      `Record did not have type: \n ${JSON.stringify(record, null, 2)}`
    )
  }

  return { __ref: getStoreKey(record) }
}

const getReference = async (
  record: SpotifyRecord,
  fetchRecord: (id: string) => Promise<SpotifyRecord>
) => {
  const key = getStoreKey(record)

  if (!refs[key]) {
    // write something immediately in case something tries to get the same record
    // before the request is finished
    refs[key] = await fetchRecord(record.id)
  }

  return toReference(record)
}

const getRecordById = (
  type: string,
  fetchRecord: (id: string) => Promise<SpotifyRecord>,
  process: (record: SpotifyRecord) => Promise<void> | void = () => {}
) => {
  return async (id: string) => {
    const key = getStoreKey({ type, id })

    if (refs[key]) {
      return refs[key]
    }

    return tap(await fetchRecord(id), async (record) => {
      refs[key] = record

      await process(record)
    })
  }
}

const getArtist = getRecordById('artist', (id: string) =>
  get('/artists/:id', { id })
)

const getAlbum = getRecordById(
  'album',
  (id: string) => get('/albums/:id', { id }),
  async (album) => {
    await Promise.all([
      ...album.tracks.items.map(async (track, idx) => {
        album.tracks.items[idx] = await getReference(track, getTrack)
      }),
      ...album.artists.map(async (artist, idx) => {
        album.artists[idx] = await getReference(artist, getArtist)
      }),
    ])
  }
)

const getTrack = getRecordById(
  'track',
  (id: string) => get<SpotifyRecord>('/tracks/:id', { id }),
  async (track) => {
    await Promise.all([
      getReference(track.album, getAlbum).then((ref) => (track.album = ref)),
      ...track.artists.map(async (artist, idx) => {
        track.artists[idx] = await getReference(artist, getArtist)
      }),
    ])
  }
)

async function tap<T>(value: T, fn: (value: T) => Promise<void> | void) {
  await fn(value)
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

const writeStore = () => {
  fs.writeFileSync(
    path.resolve(__dirname, './spotify.json'),
    JSON.stringify(refs, null, 2)
  )
}

export default async () => {
  const { spotify: config } = getWorkshopConfig()
  accessToken = (await authenticate()).access_token

  for (const id of config.albumIds) {
    await getAlbum(id)
  }

  writeStore()
}

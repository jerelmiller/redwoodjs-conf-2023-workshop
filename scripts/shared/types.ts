export interface Artist {
  id: string
  type: 'artist'
  name: string
  images: Image[]
  followers: {
    href: string | null
    total: number
  }
}

export interface Album {
  id: string
  type: 'album'
  artists: Artist[]
  name: string
  tracks: {
    items: Track[]
  }
}

export type AlbumWithRefs = Omit<Album, 'artists' | 'tracks'> & {
  artists: Reference[]
  tracks: { items: Reference[] }
}

export interface Image {
  url: string
  height: number
  width: number
}

export interface Playlist {
  id: string
  type: 'playlist'
  name: string
  tracks: {
    items: Array<{ added_at: string; track: Track }>
  }
}

export type PlaylistWithRefs = Omit<Playlist, 'tracks'> & {
  tracks: {
    items: Array<
      Omit<Playlist['tracks']['items'][0], 'track'> & { track: Reference }
    >
  }
}

export interface Track {
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

export type TrackWithRefs = Omit<Track, 'album' | 'artists'> & {
  album: Reference
  artists: Reference[]
}

export type SpotifyRecord = Artist | Album | Playlist | Track
export type SpotifyRecordWithRefs =
  | Artist
  | AlbumWithRefs
  | PlaylistWithRefs
  | TrackWithRefs

export interface Reference {
  __ref: string
}

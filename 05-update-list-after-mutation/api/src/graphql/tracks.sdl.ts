export const schema = gql`
  type Track {
    """
    The album on which the track appears.
    """
    album: Album!

    "The artists who performed the track."
    artists: [Artist!]!

    """
    The disc number (usually \`1\` unless the album consists of more than one disc).
    """
    discNumber: Int!

    "The track length in milliseconds"
    durationMs: Int!

    """
    Whether or not the track has explicit lyrics (\`true\` = yes it does;
    \`false\` = no it does not OR unknown)
    """
    explicit: Boolean!

    """
    The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track.
    """
    id: ID!

    """
    The name of the track
    """
    name: String!

    """
    The popularity of the track. The value will be between 0 and 100, with 100
    being the most popular.

    The popularity of a track is a value between 0 and 100, with 100 being the
    most popular. The popularity is calculated by algorithm and is based, in the
    most part, on the total number of plays the track has had and how recent those
    plays are.

    Generally speaking, songs that are being played a lot now will have a higher
    popularity than songs that were played a lot in the past. Duplicate tracks
    (e.g. the same track from a single and an album) are rated independently.
    Artist and album popularity is derived mathematically from track popularity.
    Note: the popularity value may lag actual popularity by a few days: the value
    is not updated in real time.
    """
    popularity: Int!

    """
    The number of the track. If an album has several discs, the track number is
    the number on the specified disc.
    """
    trackNumber: Int

    """
    The uri for the track.
    """
    uri: String!
  }

  input RemoveSavedTrackInput {
    """
    The track id to remove from to the user's library.
    """
    id: ID!
  }

  type RemoveSavedTracksResponse {
    "The track that was removed from the user's library."
    track: Track
  }

  input SaveTrackInput {
    """
    The track id to save to the user's library.
    """
    id: ID!
  }

  type SaveTrackResponse {
    "The date the track was saved."
    addedAt: DateTime

    "The track that was saved to the user's library."
    track: Track
  }

  type Mutation {
    """
    Remove one or more tracks from the current user's 'Your Music' library.
    """
    removeSavedTrack(input: RemoveSavedTrackInput!): RemoveSavedTracksResponse
      @requireAuth

    """
    Save one or more tracks to the current user's 'Your Music' library.
    """
    saveTrack(input: SaveTrackInput!): SaveTrackResponse @requireAuth
  }
`

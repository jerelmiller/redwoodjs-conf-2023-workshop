export const schema = gql`
  type PlaybackState {
    "If something is currently playing, return \`true\`."
    isPlaying: Boolean!

    "off, track, context"
    repeatMode: RepeatMode!

    "If shuffle is on or off."
    shuffleState: Boolean!

    "Unix Millisecond Timestamp when data was fetched."
    timestamp: Timestamp!
  }

  enum RepeatMode {
    CONTEXT
    OFF
    TRACK
  }

  input ResumePlaybackInput {
    """
    Spotify URI of the context to play. Valid contexts are albums, artists &
    playlists.
    """
    contextUri: String

    """
    An array of the Spotify track URIs to play.
    """
    uris: [String!]
  }

  type ResumePlaybackPayload {
    "The playback state after resuming playback."
    playbackState: PlaybackState
  }

  type Mutation {
    """
    Start a new context or resume current playback on the user's active device.
    """
    resumePlayback(input: ResumePlaybackInput): ResumePlaybackPayload
      @requireAuth
  }
`

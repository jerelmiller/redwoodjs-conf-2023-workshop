export const schema = gql`
  type PlaybackState {
    "If something is currently playing, return \`true\`."
    isPlaying: Boolean!

    context: PlaybackStateContext

    "The device that is currently active."
    device: Device!

    "off, track, context"
    repeatState: RepeatMode!

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

  type PlaybackStateContext {
    """
    The object type, e.g. "playlist", "album".
    """
    type: PlaybackStateContextType!

    """
    The uri for the context.
    """
    uri: String!
  }

  enum PlaybackStateContextType {
    ALBUM
    PLAYLIST
  }
`

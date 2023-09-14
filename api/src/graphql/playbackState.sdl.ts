export const schema = gql`
  type PlaybackState {
    "If something is currently playing, return \`true\`."
    isPlaying: Boolean!

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
`

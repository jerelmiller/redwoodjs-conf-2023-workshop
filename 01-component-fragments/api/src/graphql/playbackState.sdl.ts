export const schema = gql`
  type PlaybackState {
    "If something is currently playing, return \`true\`."
    isPlaying: Boolean!

    "A context object."
    context: PlaybackStateContext

    "The device that is currently active."
    device: Device!

    "Progress into the currently playing track or episode. Can be \`null\`"
    progressMs: Int

    "off, track, context"
    repeatState: RepeatMode!

    "If shuffle is on or off."
    shuffleState: Boolean!

    "Unix Millisecond Timestamp when data was fetched."
    timestamp: Timestamp!

    "The currently playing track."
    track: Track
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

  type SetRepeatModePayload {
    "The updated playback state"
    playbackState: PlaybackState
  }

  type ShufflePlaybackPayload {
    "The updated playback state"
    playbackState: PlaybackState
  }

  type Mutation {
    """
    Set the repeat mode for the user's playback.
    """
    setRepeatMode(
      """
      \`TRACK\`, \`CONTEXT\` or \`OFF\`.
      \`TRACK\` will repeat the current track.
      \`CONTEXT\` will repeat the current context.
      \`OFF\` will turn repeat off.
      """
      state: RepeatMode!
    ): SetRepeatModePayload @requireAuth

    """
    Toggle shuffle on or off for user’s playback.
    """
    shufflePlayback(
      """
      \`true\`: Shuffle user's playback.
      \`false\`: Do not shuffle user's playback.
      """
      state: Boolean!
    ): ShufflePlaybackPayload @requireAuth
  }
`

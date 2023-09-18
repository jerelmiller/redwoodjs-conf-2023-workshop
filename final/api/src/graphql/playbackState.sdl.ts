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

  type PausePlaybackResponse {
    "The updated playback state after pausing playback."
    playbackState: PlaybackState
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
    The track URI to play.
    """
    uri: String
  }

  type ResumePlaybackPayload {
    "The updated playback state after resuming playback."
    playbackState: PlaybackState
  }

  type SetRepeatModePayload {
    "The updated playback state after setting repeat mode."
    playbackState: PlaybackState
  }

  type ShufflePlaybackPayload {
    "The updated playback state after shuffling playback."
    playbackState: PlaybackState
  }

  type Mutation {
    """
    Pause playback on the user's account.
    """
    pausePlayback: PausePlaybackResponse @requireAuth

    """
    Start a new context or resume current playback on the user's active device.
    """
    resumePlayback(input: ResumePlaybackInput): ResumePlaybackPayload
      @requireAuth

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

export const schema = gql`
  type Player {
    "Information about a user's available devices."
    devices: [Device!]!

    """
    Information about the user's current playback state, including track,
    progress, and active device.
    """
    playbackState: PlaybackState
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
    "The playback state after resuming playback."
    player: Player
  }

  type PausePlaybackResponse {
    """
    The updated playback state
    """
    player: Player
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
  }
`

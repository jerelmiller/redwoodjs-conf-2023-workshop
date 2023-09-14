export const schema = gql`
  type Player {
    """
    Information about the user's current playback state, including track,
    progress, and active device.
    """
    playbackState: PlaybackState
  }
`

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
`

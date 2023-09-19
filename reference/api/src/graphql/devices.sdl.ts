export const schema = gql`
  type Device {
    "The device ID"
    id: ID!

    "If this device is the currently active device."
    isActive: Boolean!

    """
    A human-readable name for the device.
    """
    name: String!

    """
    Device type, such as "computer", "smartphone" or "speaker".
    """
    type: String!

    """
    The current volume in percent.

    >= 0    <= 100
    """
    volumePercent: Int!
  }

  input SetVolumeInput {
    "The volume to set. Must be a value from 0 to 100 inclusive."
    volumePercent: Int!
  }

  type SetVolumeResponse {
    "The updated device after volume was set."
    device: Device
  }

  type Mutation {
    """
    Set the volume for the user’s current playback device.
    """
    setVolume(input: SetVolumeInput!): SetVolumeResponse
  }
`

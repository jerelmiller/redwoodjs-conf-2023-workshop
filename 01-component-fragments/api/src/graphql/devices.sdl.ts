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
`

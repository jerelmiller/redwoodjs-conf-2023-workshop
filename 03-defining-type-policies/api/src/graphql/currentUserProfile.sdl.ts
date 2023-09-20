export const schema = gql`
  type CurrentUserProfile {
    """
    The unique identifier for the user.
    """
    id: ID!

    """
    The name displayed on the user's profile. \`null\` if not available.
    """
    displayName: String

    """
    The user's profile image.
    """
    images: [Image!]!
  }
`

export const schema = gql`
  type CurrentUser {
    profile: CurrentUserProfile
    playlists: PlaylistConnection
  }

  type Query {
    # We can skip auth here because this field will return null when the user is not logged in
    me: CurrentUser @skipAuth
  }
`

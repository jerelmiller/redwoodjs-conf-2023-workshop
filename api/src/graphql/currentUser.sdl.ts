export const schema = gql`
  type CurrentUser {
    profile: CurrentUserProfile
  }

  type Query {
    me: CurrentUser @skipAuth
  }
`

export const schema = gql`
  type Artist {
    id: String!
    name: String!
    followerCount: Int!
  }

  type Query {
    artist(id: String!): Artist @skipAuth
  }
`

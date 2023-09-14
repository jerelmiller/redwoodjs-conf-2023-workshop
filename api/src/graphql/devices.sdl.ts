export const schema = gql`
  type Device {
    id: ID!
    name: String!
    type: String!
    volumePercent: Int!
  }
`

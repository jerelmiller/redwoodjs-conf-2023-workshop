export const schema = gql`
  type Image {
    url: String!
    height: Int
    width: Int
    vibrantColor(alpha: Float): String
  }
`

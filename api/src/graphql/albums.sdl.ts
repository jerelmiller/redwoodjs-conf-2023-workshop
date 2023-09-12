export const schema = gql`
  type Album {
    """
    The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
    for the album.
    """
    id: ID!

    """
    The name of the album. In case of an album takedown, the value may be an empty
    string.
    """
    name: String!
  }

  type Query {
    album(id: ID!): Album @requireAuth
  }
`

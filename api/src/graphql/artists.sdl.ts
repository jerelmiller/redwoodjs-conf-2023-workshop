export const schema = gql`
  type Artist {
    """
    The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
    for the album.
    """
    id: ID!

    """
    Information about the followers of the artist.
    """
    followerCount: Int!

    """
    Images of the artist in various sizes, widest first.
    """
    images: [Image!]!

    """
    The name of the artist.
    """
    name: String!
  }

  enum AlbumGroup {
    ALBUM
    SINGLE
    APPEARS_ON
    COMPILATION
  }

  type Query {
    artist(id: ID!): Artist @skipAuth
  }
`

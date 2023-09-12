export const schema = gql`
  type Artist {
    """
    Spotify catalog information about an artist's albums.
    """
    albums(
      """
      Used to filter the response. If not supplied, all album types will be
      returned.
      """
      includeGroups: [AlbumGroup!]

      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first item to return. Default: 0 (the first item). Use
      with \`limit\` to get the next set of items.
      """
      offset: Int = 0
    ): ArtistAlbumsConnection

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

  type ArtistAlbumsConnection {
    """
    A list of albums that belong to the artist.
    """
    edges: [ArtistAlbumEdge!]

    """
    "Pagination information for the set of albums"
    """
    pageInfo: PageInfo!
  }

  type ArtistAlbumEdge {
    """
    Spotify catalog information for the album.
    """
    node: Album!
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

export const schema = gql`
  type Album {
    """
    The type of the album.
    """
    albumType: AlbumType!

    "The artists of the album."
    artists: [Artist!]!

    """
    The copyrights for the album.
    """
    copyrights: [Copyright!]!

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

    """
    The cover art for the album in various sizes, widest first.
    """
    images: [Image!]!

    """
    The date the album was first released.
    """
    releaseDate: ReleaseDate!

    """
    The tracks of the album.
    """
    tracks(
      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first playlist to return. Default: 0 (the first object).

      Use with \`limit\` to get the next set of tracks.
      """
      offset: Int = 0
    ): AlbumTrackConnection
  }

  type AlbumConnection {
    "The set of albums."
    edges: [AlbumEdge!]!

    "Pagination information for the set of albums."
    pageInfo: PageInfo!
  }

  type AlbumEdge {
    "The album."
    node: Album!
  }

  type AlbumTrackConnection {
    "The set of tracks."
    edges: [AlbumTrackEdge!]!

    "Pagination information for the set of tracks."
    pageInfo: PageInfo!
  }

  type AlbumTrackEdge {
    "The track on the album"
    node: Track!
  }

  enum AlbumType {
    ALBUM
    SINGLE
    COMPILATION
  }

  type Query {
    """
    Get an album by ID.
    """
    album(id: ID!): Album @requireAuth

    """
    Get a list of albums.
    """
    albums(
      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first album to return. Default: 0 (the first object).

      Use with \`limit\` to get the next set of albums.
      """
      offset: Int = 0
    ): AlbumConnection
  }
`

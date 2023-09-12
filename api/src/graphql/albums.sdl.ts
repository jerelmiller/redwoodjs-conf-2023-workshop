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

    """
    The cover art for the album in various sizes, widest first.
    """
    images: [Image!]!

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

  type Query {
    album(id: ID!): Album @requireAuth
  }
`

export const schema = gql`
  type Playlist {
    """
    The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
    for the playlist.
    """
    id: ID!

    """
    Images for the playlist. The array may be empty or contain up to three images.
    The images are returned by size in descending order.
    See [Working with Playlists](https://developer.spotify.com/documentation/general/guides/working-with-playlists/).
    **Note**: If returned, the source URL for the image (\`url\`) is temporary and
    will expire in less than a day.
    """
    images: [Image!]!

    """
    The name of the playlist.
    """
    name: String!

    """
    The user who owns the playlist.
    """
    owner: User!

    "The tracks of the playlist."
    tracks(
      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first item to return. Default: 0 (the first item).

      Use with \`limit\` to get the next set of items.
      """
      offset: Int = 0
    ): PlaylistTrackConnection!
  }

  type PlaylistConnection {
    "The set of playlists."
    edges: [PlaylistEdge!]!

    "Pagination information for the set of playlists"
    pageInfo: PageInfo!
  }

  type PlaylistEdge {
    "The playlist"
    node: Playlist!
  }

  type PlaylistTrackConnection {
    "Pagination information for the tracks belonging to a playlist"
    edges: [PlaylistTrackEdge!]!

    "Pagination information for the tracks belonging to a playlist"
    pageInfo: PageInfo!
  }

  type PlaylistTrackEdge {
    "The date and time the track was added to the playlist"
    addedAt: DateTime

    "The user that added the track to the playlist"
    addedBy: User!

    "The playlist track"
    node: Track!
  }

  type Query {
    """
    Get a playlist owned by a Spotify user.
    """
    playlist(id: ID!): Playlist @requireAuth
  }
`

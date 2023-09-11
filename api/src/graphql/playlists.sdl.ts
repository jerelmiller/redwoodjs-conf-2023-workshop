export const schema = gql`
  type Playlist {
    """
    The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
    for the playlist.
    """
    id: ID!

    """
    The name of the playlist.
    """
    name: String!

    """
    The user who owns the playlist.
    """
    owner: User!
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
`

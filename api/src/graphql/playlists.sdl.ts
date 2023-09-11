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

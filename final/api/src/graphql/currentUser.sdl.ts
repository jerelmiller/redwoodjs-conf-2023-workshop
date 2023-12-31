export const schema = gql`
  type CurrentUser {
    profile: CurrentUserProfile
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
    ): SavedAlbumConnection

    """
    Information about the user's current playback state
    """
    player: Player!

    playlists(
      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first playlist to return. Default: 0 (the first object).

      Use with \`limit\` to get the next set of playlists.
      """
      offset: Int = 0
    ): PlaylistConnection

    tracks(
      """
      The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
      """
      limit: Int = 20

      """
      The index of the first track to return. Default: 0 (the first object).

      Use with \`limit\` to get the next set of tracks.
      """
      offset: Int = 0
    ): SavedTracksConnection

    """
    Check if one or more tracks is already saved in the current user's library.
    """
    tracksContains(
      """
      A comma-separated list of the IDs for the tracks.
      """
      ids: [ID!]!
    ): [Boolean!]
  }

  type SavedAlbumConnection {
    """
    A list of saved albums.
    """
    edges: [SavedAlbumEdge!]!
  }

  type SavedAlbumEdge {
    """
    The date the album was saved.
    """
    addedAt: DateTime!

    "The saved album."
    node: Album!
  }

  type SavedTrackEdge {
    "The date the track was saved."
    addedAt: DateTime!

    "The track"
    node: Track!
  }

  type SavedTracksConnection {
    """
    A list of saved tracks.
    """
    edges: [SavedTrackEdge!]!

    """
    "Pagination information for the set of playlists"
    """
    pageInfo: PageInfo!
  }

  type Query {
    # We can skip auth here because this field will return null when the user is not logged in
    me: CurrentUser @skipAuth
  }
`

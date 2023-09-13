export const schema = gql`
  type CurrentUser {
    profile: CurrentUserProfile
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

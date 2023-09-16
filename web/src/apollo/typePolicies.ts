import type { TypePolicies } from '@apollo/client'

export const typePolicies: TypePolicies = {
  CurrentUser: {
    keyFields: [],
  },
  Image: {
    keyFields: ['url'],
  },
  Player: {
    keyFields: [],
  },
  Playlist: {
    fields: {
      tracks: {
        keyArgs: false,
      },
    },
  },
  PlaylistTrackConnection: {
    fields: {
      edges: {
        merge(existing = [], incoming = []) {
          return [...existing, ...incoming]
        },
      },
    },
  },
  PlaybackState: {
    keyFields: [],
  },
}

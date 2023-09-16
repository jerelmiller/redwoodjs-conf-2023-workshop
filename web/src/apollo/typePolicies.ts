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
        merge(existing = [], incoming = [], { args }) {
          const edges = existing.slice(0)

          if (args) {
            const { offset = 0 } = args

            for (let i = 0; i < incoming.length; i++) {
              edges[offset + i] = incoming[i]
            }
          } else {
            edges.push(...incoming)
          }

          return edges
        },
      },
    },
  },
  PlaybackState: {
    keyFields: [],
  },
}

import type { TypePolicies } from '@apollo/client'

export const typePolicies: TypePolicies = {
  PlaybackState: {
    keyFields: [],
  },
  Player: {
    keyFields: [],
  },
  Playlist: {
    fields: {
      tracks: {
        keyArgs: false,
        merge: (existing, incoming, { args, mergeObjects }) => {
          const result = {
            __typename: 'PlaylistTrackConnection',
            pageInfo: mergeObjects(existing?.pageInfo ?? {}, incoming.pageInfo),
            edges: existing?.edges.slice(0) ?? [],
          }

          // Allows for loading data on an offset that might not be the end of
          // the list
          if (args) {
            const { offset = 0 } = args

            for (let i = 0; i < incoming.edges.length; i++) {
              result.edges[offset + i] = incoming.edges[i]
            }
          } else {
            result.edges.push(...incoming.edges)
          }

          return result
        },
      },
    },
  },
  CurrentUser: {
    keyFields: [],
    fields: {
      tracks: {
        keyArgs: false,
        merge: (existing, incoming, { args, mergeObjects }) => {
          const result = {
            __typename: 'SavedTracksConnection',
            pageInfo: mergeObjects(existing?.pageInfo ?? {}, incoming.pageInfo),
            edges: existing?.edges.slice(0) ?? [],
          }

          // Allows for loading data on an offset that might not be the end of
          // the list
          if (args) {
            const { offset = 0 } = args

            for (let i = 0; i < incoming.edges.length; i++) {
              result.edges[offset + i] = incoming.edges[i]
            }
          } else {
            result.edges.push(...incoming.edges)
          }

          return result
        },
      },
    },
  },
}

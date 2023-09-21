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
      tracksContains: {
        keyArgs: false,
        read: (value, { args, storage }) => {
          const ids: string[] = args?.ids ?? []

          return ids.map((id) => storage.contains?.get(id))
        },
        merge: (existing = [], incoming, { args, storage }) => {
          if (!args) {
            return existing
          }

          const contains: Map<string, boolean> = storage.contains ?? new Map()
          const ids: string[] = args?.ids ?? []

          const result = ids.reduce(
            (map, id, idx) => map.set(id, incoming[idx]),
            contains
          )

          storage.contains = result

          return Array.from(result.values())
        },
      },
    },
  },
}

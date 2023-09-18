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
        // Define this on the `tracks` field instead of the `PlaylistTrackConnection`
        // type because we need access to `args`
        merge(existing, incoming, { args, mergeObjects }) {
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
  PlaybackState: {
    keyFields: [],
  },
}

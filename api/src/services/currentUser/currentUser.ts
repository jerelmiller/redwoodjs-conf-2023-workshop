import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const me: QueryResolvers['me'] = () => {
  return context.currentUser ?? null
}

export const CurrentUser: CurrentUserResolvers = {
  playlists: async () => {
    const playlists = await db.playlist.findMany()

    return {
      pageInfo: {
        limit: 0,
        offset: 0,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges: playlists.map((playlist) => ({ node: playlist })),
    }
  },
  profile: () => context.currentUser ?? null,
}

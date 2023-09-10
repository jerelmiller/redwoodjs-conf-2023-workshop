import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const me: QueryResolvers['me'] = () => {
  return context.currentUser ?? null
}

export const CurrentUser: CurrentUserResolvers = {
  playlists: async ({ limit, offset }) => {
    const total = await db.playlist.count()
    const playlists = await db.playlist.findMany({
      skip: offset,
      take: limit,
    })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: offset + playlists.length < total,
        hasPreviousPage: total > 0 && offset > 0,
      },
      edges: playlists.map((playlist) => ({ node: playlist })),
    }
  },
  profile: () => context.currentUser ?? null,
}

import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const me: QueryResolvers['me'] = () => {
  return context.currentUser ?? null
}

export const CurrentUser: CurrentUserResolvers = {
  playlists: async ({ limit, offset }) => {
    // We can safely assume we have a current user since the `me` field returns
    // `null` otherwise
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!
    const total = await db.playlist.count({ where: { userId: currentUser.id } })
    const playlists = await db.playlist.findMany({
      where: { userId: currentUser.id },
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

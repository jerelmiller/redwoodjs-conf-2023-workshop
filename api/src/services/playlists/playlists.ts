import type { PlaylistRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const Playlist: PlaylistRelationResolvers = {
  owner: (_, { root }) => {
    return db.user.findFirstOrThrow({ where: { id: root.userId } })
  },
}

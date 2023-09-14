import { PlayerRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const Player: PlayerRelationResolvers = {
  playbackState: () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!

    return db.playbackState.findUnique({ where: { userId: currentUser.id } })
  },
}

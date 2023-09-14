import { PlaybackStateRelationResolvers, RepeatMode } from 'types/graphql'

import { db } from 'src/lib/db'

export const PlaybackState: PlaybackStateRelationResolvers = {
  device: async (_, { root }) => {
    return db.playbackState
      .findUniqueOrThrow({ where: { id: root.id } })
      .device()
  },
  repeatState: (_, { root }) => root.repeatMode as RepeatMode,
  shuffleState: (_, { root }) => root.shuffled,
  timestamp: () => new Date(),
}

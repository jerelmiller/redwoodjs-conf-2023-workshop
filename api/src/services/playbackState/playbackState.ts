import {
  PlaybackStateContextRelationResolvers,
  PlaybackStateContextType,
  PlaybackStateRelationResolvers,
  RepeatMode,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const PlaybackState: PlaybackStateRelationResolvers = {
  context: (_, { root }) => root.contextUri,
  device: async (_, { root }) => {
    return db.playbackState
      .findUniqueOrThrow({ where: { id: root.id } })
      .device()
  },
  repeatState: (_, { root }) => root.repeatMode as RepeatMode,
  shuffleState: (_, { root }) => root.shuffled,
  timestamp: () => new Date(),
}

export const PlaybackStateContext: PlaybackStateContextRelationResolvers = {
  type: (_, { root }) => {
    const [type] = root.split(':')

    return type.toUpperCase() as PlaybackStateContextType
  },
  uri: (_, { root }) => root,
}

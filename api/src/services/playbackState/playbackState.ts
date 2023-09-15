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
  progressMs: (_, { root }) => {
    if (!root.lastPlayedAt) {
      return null
    }

    if (!root.isPlaying) {
      return root.progressMs
    }

    return new Date().getTime() - root.lastPlayedAt.getTime() + root.progressMs
  },
  repeatState: (_, { root }) => root.repeatMode as RepeatMode,
  shuffleState: (_, { root }) => root.shuffled,
  timestamp: () => new Date(),
  track: (_, { root }) => {
    if (!root.currentTrackUri) {
      return null
    }

    const [, id] = root.currentTrackUri.split(':')

    return db.track.findUnique({ where: { id } })
  },
}

export const PlaybackStateContext: PlaybackStateContextRelationResolvers = {
  type: (_, { root }) => {
    const [type] = root.split(':')

    return type.toUpperCase() as PlaybackStateContextType
  },
  uri: (_, { root }) => root,
}

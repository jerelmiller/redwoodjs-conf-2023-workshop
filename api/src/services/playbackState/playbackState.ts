import { PlaybackStateRelationResolvers, RepeatMode } from 'types/graphql'

export const PlaybackState: PlaybackStateRelationResolvers = {
  repeatState: (_, { root }) => root.repeatMode as RepeatMode,
  shuffleState: (_, { root }) => root.shuffled,
  timestamp: () => new Date(),
}

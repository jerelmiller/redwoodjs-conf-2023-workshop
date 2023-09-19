import type { TrackRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const Track: TrackRelationResolvers = {
  album: (_obj, { root }) => {
    return db.track.findUniqueOrThrow({ where: { id: root.id } }).album()
  },
  artists: (_obj, { root }) => {
    return db.track.findUniqueOrThrow({ where: { id: root.id } }).artists()
  },
  uri: (_, { root }) => `track:${root.id}`,
}

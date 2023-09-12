import type { TrackRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const Track: TrackRelationResolvers = {
  // album: (_obj, { root }) => {
  //   return db.track.findUnique({ where: { id: root?.id } }).album()
  // },
  artists: (_obj, { root }) => {
    return db.artist.findMany({ where: { tracks: { some: { id: root.id } } } })
  },
}

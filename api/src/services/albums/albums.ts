import type { QueryResolvers, AlbumRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const album: QueryResolvers['album'] = ({ id }) => {
  return db.album.findUnique({ where: { id } })
}

export const Album: AlbumRelationResolvers = {}

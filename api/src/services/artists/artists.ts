import type { ArtistRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const artist: QueryResolvers['artist'] = ({ id }) => {
  return db.artist.findUnique({
    where: { id },
  })
}

export const Artist: ArtistRelationResolvers = {
  images: (_, { root }) => {
    return db.artist.findUniqueOrThrow({ where: { id: root.id } }).images()
  },
}

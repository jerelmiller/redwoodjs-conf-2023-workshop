import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const artist: QueryResolvers['artist'] = ({ id }) => {
  return db.artist.findUnique({
    where: { id },
  })
}

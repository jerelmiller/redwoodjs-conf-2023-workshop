import type { QueryResolvers, PlaylistRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const playlist: QueryResolvers['playlist'] = ({ id }) => {
  return db.playlist.findUnique({ where: { id } })
}

export const Playlist: PlaylistRelationResolvers = {
  images: (_, { root }) => {
    return db.image.findMany({
      where: { playlists: { some: { id: root.id } } },
      orderBy: [{ width: 'desc' }, { height: 'desc' }],
    })
  },
  owner: (_, { root }) => {
    return db.user.findFirstOrThrow({ where: { id: root.userId } })
  },
}

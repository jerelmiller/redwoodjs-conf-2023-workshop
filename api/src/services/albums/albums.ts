import type {
  AlbumType,
  QueryResolvers,
  AlbumRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const album: QueryResolvers['album'] = ({ id }) => {
  return db.album.findUnique({ where: { id } })
}

export const Album: AlbumRelationResolvers = {
  albumType: (_, { root }) => root.albumType.toUpperCase() as AlbumType,
  images: (_, { root }) => {
    return db.album.findUniqueOrThrow({ where: { id: root.id } }).images()
  },
  tracks: async ({ limit, offset }, { root }) => {
    const total = await db.track.count({ where: { albumId: root.id } })
    const tracks = await db.album
      .findUniqueOrThrow({ where: { id: root.id } })
      .tracks({
        take: limit,
        skip: offset,
        orderBy: [{ discNumber: 'asc' }, { trackNumber: 'asc' }],
      })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: offset + tracks.length < total,
        hasPreviousPage: tracks.length > 0 && offset > 0,
      },
      edges: tracks.map((track) => ({ node: track })),
    }
  },
}

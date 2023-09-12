import type { ArtistRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const artist: QueryResolvers['artist'] = ({ id }) => {
  return db.artist.findUnique({
    where: { id },
  })
}

export const Artist: ArtistRelationResolvers = {
  albums: async ({ limit, offset }, { root }) => {
    const total = await db.album.count({
      where: { artists: { some: { id: root.id } } },
    })
    const albums = await db.artist
      .findUniqueOrThrow({ where: { id: root.id } })
      .albums({ take: limit, skip: offset })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: offset + albums.length < total,
        hasPreviousPage: offset > 0 && total > 0,
      },
      edges: albums.map((album) => ({ node: album })),
    }
  },
  images: (_, { root }) => {
    return db.artist.findUniqueOrThrow({ where: { id: root.id } }).images()
  },
}

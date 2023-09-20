import type {
  AlbumType,
  AlbumRelationResolvers,
  QueryResolvers,
  ReleaseDatePrecision,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const album: QueryResolvers['album'] = ({ id }) => {
  return db.album.findUnique({ where: { id } })
}

export const albums: QueryResolvers['albums'] = async ({ limit, offset }) => {
  const total = await db.album.count()
  const albums = await db.album.findMany({ skip: offset, take: limit })

  return {
    pageInfo: {
      total,
      offset,
      limit,
      hasNextPage: offset + albums.length < total,
      hasPreviousPage: offset > 0 && albums.length > 0,
    },
    edges: albums.map((album) => ({ node: album })),
  }
}

export const Album: AlbumRelationResolvers = {
  albumType: (_, { root }) => root.albumType.toUpperCase() as AlbumType,
  artists: (_, { root }) => {
    return db.album.findUniqueOrThrow({ where: { id: root.id } }).artists()
  },
  copyrights: (_, { root }) => {
    return db.album.findUniqueOrThrow({ where: { id: root.id } }).copyrights()
  },
  images: (_, { root }) => {
    return db.album.findUniqueOrThrow({ where: { id: root.id } }).images()
  },
  releaseDate: (_, { root }) => {
    return {
      date: root.releaseDate,
      precision:
        root.releaseDatePrecision.toUpperCase() as ReleaseDatePrecision,
    }
  },
  uri: (_, { root }) => `album:${root.id}`,
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

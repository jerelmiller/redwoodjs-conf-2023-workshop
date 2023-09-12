import type {
  QueryResolvers,
  PlaylistRelationResolvers,
  PlaylistTrackEdgeRelationResolvers,
} from 'types/graphql'

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
  tracks: async ({ limit, offset }, { root }) => {
    const total = await db.playlistTrack.count({
      where: { playlistId: root.id },
    })

    const playlistTracks = await db.playlistTrack.findMany({
      where: { playlistId: root.id },
      skip: offset,
      take: limit,
      include: {},
      orderBy: {
        addedAt: 'asc',
      },
    })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: offset + playlistTracks.length < total,
        hasPreviousPage: total > 0 && offset > 0,
      },
      edges: playlistTracks,
    }
  },
}

export const PlaylistTrackEdge: PlaylistTrackEdgeRelationResolvers = {
  addedBy: async (_, { root }) => {
    return db.user.findUniqueOrThrow({ where: { id: root.addedById } })
  },
  node: async (_, { root }) => {
    return db.track.findUniqueOrThrow({ where: { id: root.trackId } })
  },
}

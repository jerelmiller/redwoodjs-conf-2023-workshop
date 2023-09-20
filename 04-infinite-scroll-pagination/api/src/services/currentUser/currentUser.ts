import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const me: QueryResolvers['me'] = () => {
  return context.currentUser ?? null
}

// We can safely assume we have a current user in these resolvers since the `me`
// field returns `null` when the user is not logged in
export const CurrentUser: CurrentUserResolvers = {
  albums: async ({ limit, offset }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!
    const total = await db.savedAlbum.count({
      where: { userId: currentUser.id },
    })
    const savedAlbums = await db.savedAlbum.findMany({
      where: { userId: currentUser.id },
      skip: offset,
      take: limit,
      include: {
        album: true,
      },
    })

    return {
      pageInfo: {
        total,
        offset,
        limit,
        hasNextPage: offset + savedAlbums.length < total,
        hasPreviousPage: total > 0 && offset > 0,
      },
      edges: savedAlbums.map((savedAlbum) => ({
        addedAt: savedAlbum.addedAt,
        node: savedAlbum.album,
      })),
    }
  },
  player: () => ({}),
  playlists: async ({ limit, offset }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!
    const total = await db.playlist.count({ where: { userId: currentUser.id } })
    const playlists = await db.playlist.findMany({
      where: { userId: currentUser.id },
      skip: offset,
      take: limit,
    })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: offset + playlists.length < total,
        hasPreviousPage: total > 0 && offset > 0,
      },
      edges: playlists.map((playlist) => ({ node: playlist })),
    }
  },
  profile: () => context.currentUser ?? null,
  tracks: async ({ limit, offset }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!
    const total = await db.savedTrack.count({
      where: { userId: currentUser.id },
    })
    const savedTracks = await db.savedTrack.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        track: true,
      },
    })

    return {
      pageInfo: {
        limit,
        offset,
        total,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges: savedTracks.map((savedTrack) => ({
        addedAt: savedTrack.addedAt,
        node: savedTrack.track,
      })),
    }
  },
  tracksContains: async ({ ids }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!

    const savedTracks = await db.savedTrack.findMany({
      where: { userId: currentUser.id, trackId: { in: ids } },
      select: { trackId: true },
    })

    const savedTrackIds = savedTracks.map((track) => track.trackId)

    return ids.map((id) => savedTrackIds.includes(id))
  },
}

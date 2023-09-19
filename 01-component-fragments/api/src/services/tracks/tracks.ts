import type { TrackRelationResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const removeSavedTrack: MutationResolvers['removeSavedTrack'] = async ({
  input,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!

  await db.savedTrack.delete({
    where: { trackId_userId: { userId: currentUser.id, trackId: input.id } },
  })

  const track = await db.track.findUnique({ where: { id: input.id } })

  return { track }
}

export const saveTrack: MutationResolvers['saveTrack'] = async ({ input }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!

  const savedTrack = await db.savedTrack.upsert({
    select: { addedAt: true, track: true },
    where: {
      trackId_userId: { userId: currentUser.id, trackId: input.id },
    },
    create: {
      user: {
        connect: { id: currentUser.id },
      },
      track: {
        connect: { id: input.id },
      },
    },
    update: {},
  })

  return savedTrack
}

export const Track: TrackRelationResolvers = {
  album: (_obj, { root }) => {
    return db.track.findUniqueOrThrow({ where: { id: root.id } }).album()
  },
  artists: (_obj, { root }) => {
    return db.track.findUniqueOrThrow({ where: { id: root.id } }).artists()
  },
  uri: (_, { root }) => `track:${root.id}`,
}

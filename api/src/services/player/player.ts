import { PlayerRelationResolvers, MutationResolvers } from 'types/graphql'

import { UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const resumePlayback: MutationResolvers['resumePlayback'] = async ({
  input: _input,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const device = await db.device.findFirst({
    where: { userId: currentUser.id },
  })

  if (!device) {
    throw new UserInputError('No active device found.')
  }

  await db.device.update({
    where: { id: device.id },
    data: {
      isActive: true,
    },
  })

  await db.playbackState.upsert({
    where: { userId: currentUser.id },
    create: {
      isPlaying: true,
      user: {
        connect: { id: currentUser.id },
      },
      device: {
        connect: { id: device.id },
      },
    },
    update: {
      isPlaying: true,
    },
  })

  return {
    player: {},
  }
}

export const pausePlayback: MutationResolvers['pausePlayback'] = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const exists = await db.playbackState
    .findFirst({ where: { userId: currentUser.id } })
    .then(Boolean)

  if (!exists) {
    throw new UserInputError('You are not playing anything')
  }

  await db.playbackState.update({
    where: { userId: currentUser.id },
    data: {
      isPlaying: false,
    },
  })

  return {
    player: {},
  }
}

export const Player: PlayerRelationResolvers = {
  devices: () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!

    return db.device.findMany({ where: { userId: currentUser.id } })
  },
  playbackState: () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = context.currentUser!

    return db.playbackState.findUnique({ where: { userId: currentUser.id } })
  },
}

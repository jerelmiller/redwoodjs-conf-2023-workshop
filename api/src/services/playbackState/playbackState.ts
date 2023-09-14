import { MutationResolvers } from 'types/graphql'
import { UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const resumePlayback: MutationResolvers['resumePlayback'] = async ({
  input: _input,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const playbackState = await db.playbackState.upsert({
    where: { userId: currentUser.id },
    create: {
      isPlaying: true,
      user: {
        connect: { id: currentUser.id },
      },
    },
    update: {
      isPlaying: true,
    },
  })

  return {
    playbackState,
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

  const playbackState = await db.playbackState.update({
    where: { userId: currentUser.id },
    data: {
      isPlaying: false,
    },
  })

  return {
    playbackState,
  }
}

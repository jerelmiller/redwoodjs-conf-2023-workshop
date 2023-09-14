import { MutationResolvers } from 'types/graphql'

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

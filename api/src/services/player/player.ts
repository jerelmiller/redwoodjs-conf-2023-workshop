import { PlayerRelationResolvers, MutationResolvers } from 'types/graphql'

import { UserInputError } from '@redwoodjs/graphql-server'

import { db, findByUri } from 'src/lib/db'
import { z } from 'zod'

const ResumePlaybackInput = z
  .object({
    contextUri: z
      .string()
      .optional()
      .nullable()
      .refine(
        async (contextUri) => (contextUri ? findByUri(contextUri) : true),
        (contextUri) => ({
          message: `Record with uri '${contextUri}' not found`,
        })
      ),
    uri: z
      .string()
      .optional()
      .superRefine(async (uri, ctx) => {
        if (!uri) {
          return z.NEVER
        }

        const [type] = uri.split(':')

        if (type !== 'track') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Cannot play a uri that is not a track',
          })
        }

        const track = await findByUri(uri)

        if (!track) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Cannot play track with uri '${uri}' because it does not exist.'`,
          })
        }

        return z.NEVER
      }),
  })
  .optional()

export const resumePlayback: MutationResolvers['resumePlayback'] = async ({
  input,
}) => {
  const result = await ResumePlaybackInput.safeParseAsync(input)

  if (!result.success) {
    throw new UserInputError(result.error.issues[0].message)
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const device = await db.device.findFirst({
    where: { userId: currentUser.id },
  })

  if (!device) {
    throw new UserInputError('No device found.')
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
      contextUri: input?.contextUri,
      currentTrackUri: input?.uri,
      lastPlayedAt: new Date(),
      progressMs: input?.uri || input?.contextUri ? 0 : undefined,
      user: {
        connect: { id: currentUser.id },
      },
      device: {
        connect: { id: device.id },
      },
    },
    update: {
      isPlaying: true,
      contextUri: input?.contextUri,
      currentTrackUri: input?.uri,
      lastPlayedAt: new Date(),
    },
  })

  return {
    player: {},
  }
}

export const pausePlayback: MutationResolvers['pausePlayback'] = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const playbackState = await db.playbackState.findFirst({
    where: { userId: currentUser.id },
  })

  if (!playbackState) {
    throw new UserInputError('You are not playing anything')
  }

  await db.playbackState.update({
    where: { userId: currentUser.id },
    data: {
      isPlaying: false,
      progressMs: playbackState.isPlaying
        ? new Date().getTime() -
          playbackState.lastPlayedAt!.getTime() +
          playbackState.progressMs
        : undefined,
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

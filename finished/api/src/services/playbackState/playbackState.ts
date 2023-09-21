import {
  PlaybackStateContextRelationResolvers,
  PlaybackStateContextType,
  PlaybackStateRelationResolvers,
  RepeatMode,
  MutationResolvers,
} from 'types/graphql'
import { z } from 'zod'

import { UserInputError } from '@redwoodjs/graphql-server'

import { db, findByUri } from 'src/lib/db'

const LIKED_TRACKS_CONTEXT_URI = 'collection:tracks'

const ResumePlaybackInput = z
  .object({
    contextUri: z
      .string()
      .optional()
      .nullable()
      .refine(
        async (contextUri) => {
          if (contextUri === LIKED_TRACKS_CONTEXT_URI) {
            return true
          }

          return contextUri ? findByUri(contextUri) : true
        },
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

const getFirstTrackInContext = async (contextUri: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const [type, id] = contextUri.split(':')
  let track: { id: string } | null = null

  switch (type) {
    case 'album': {
      track = await db.track.findFirst({
        where: { albumId: id },
        orderBy: { trackNumber: 'asc' },
        select: { id: true },
      })
      break
    }
    case 'playlist': {
      track = await db.playlistTrack
        .findFirst({
          where: { playlistId: id },
          select: { trackId: true },
          orderBy: { addedAt: 'asc' },
        })
        .then((track) => (track ? { id: track.trackId } : null))
      break
    }
    case 'collection': {
      track = await db.savedTrack
        .findFirst({
          where: { userId: currentUser.id },
          select: { trackId: true },
          orderBy: { addedAt: 'asc' },
        })
        .then((track) => (track ? { id: track.trackId } : null))
      break
    }
  }

  if (!track) {
    throw new UserInputError('This context has no tracks')
  }

  return `track:${track.id}`
}

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

  let currentTrackUri = input?.uri

  if (input?.contextUri && !input.uri) {
    currentTrackUri = await getFirstTrackInContext(input.contextUri)
  }

  await db.device.update({
    where: { id: device.id },
    data: {
      isActive: true,
    },
  })

  const playbackState = await db.playbackState.upsert({
    where: { userId: currentUser.id },
    create: {
      isPlaying: true,
      contextUri: input?.contextUri,
      currentTrackUri,
      lastPlayedAt: new Date(),
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
      currentTrackUri,
      lastPlayedAt: new Date(),
      progressMs: input?.uri || input?.contextUri ? 0 : undefined,
    },
  })

  return { playbackState }
}

export const pausePlayback: MutationResolvers['pausePlayback'] = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const currentPlaybackState = await db.playbackState.findFirst({
    where: { userId: currentUser.id },
  })

  if (!currentPlaybackState) {
    throw new UserInputError('You are not playing anything')
  }

  const playbackState = await db.playbackState.update({
    where: { userId: currentUser.id },
    data: {
      isPlaying: false,
      progressMs: currentPlaybackState.isPlaying
        ? new Date().getTime() -
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          currentPlaybackState.lastPlayedAt!.getTime() +
          currentPlaybackState.progressMs
        : undefined,
    },
  })

  return {
    playbackState,
  }
}

export const setRepeatMode: MutationResolvers['setRepeatMode'] = async ({
  input,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const device = await db.device.findFirst({
    where: { userId: currentUser.id },
  })

  if (!device) {
    throw new UserInputError('No device found.')
  }

  const playbackState = await db.playbackState.upsert({
    where: { userId: currentUser.id },
    create: {
      repeatMode: input.state,
      user: {
        connect: { id: currentUser.id },
      },
      device: {
        connect: { id: device.id },
      },
    },
    update: {
      repeatMode: input.state,
    },
  })

  return {
    playbackState,
  }
}

export const shufflePlayback: MutationResolvers['shufflePlayback'] = async ({
  input,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const device = await db.device.findFirst({
    where: { userId: currentUser.id },
  })

  if (!device) {
    throw new UserInputError('No device found.')
  }

  const playbackState = await db.playbackState.upsert({
    where: { userId: currentUser.id },
    create: {
      shuffled: input.state,
      user: {
        connect: { id: currentUser.id },
      },
      device: {
        connect: { id: device.id },
      },
    },
    update: {
      shuffled: input.state,
    },
  })

  return {
    playbackState,
  }
}

export const PlaybackState: PlaybackStateRelationResolvers = {
  context: (_, { root }) => root.contextUri,
  device: async (_, { root }) => {
    return db.playbackState
      .findUniqueOrThrow({ where: { id: root.id } })
      .device()
  },
  progressMs: (_, { root }) => {
    if (!root.lastPlayedAt) {
      return null
    }

    if (!root.isPlaying) {
      return root.progressMs
    }

    return new Date().getTime() - root.lastPlayedAt.getTime() + root.progressMs
  },
  repeatState: (_, { root }) => root.repeatMode as RepeatMode,
  shuffleState: (_, { root }) => root.shuffled,
  timestamp: () => new Date(),
  track: (_, { root }) => {
    if (!root.currentTrackUri) {
      return null
    }

    const [, id] = root.currentTrackUri.split(':')

    return db.track.findUnique({ where: { id } })
  },
}

export const PlaybackStateContext: PlaybackStateContextRelationResolvers = {
  type: (_, { root }) => {
    const [type] = root.split(':')

    return type.toUpperCase() as PlaybackStateContextType
  },
  uri: (_, { root }) => root,
}

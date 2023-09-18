import type { DeviceRelationResolvers, MutationResolvers } from 'types/graphql'

import { UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const setVolume: MutationResolvers['setVolume'] = async ({ input }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentUser = context.currentUser!
  const device = await db.device.findFirst({
    where: { userId: currentUser.id, isActive: true },
  })

  if (!device) {
    throw new UserInputError('No active device found.')
  }

  const updatedDevice = await db.device.update({
    where: { id: device.id },
    data: { volumePercent: input.volumePercent },
  })

  return { device: updatedDevice }
}

export const Device: DeviceRelationResolvers = {}

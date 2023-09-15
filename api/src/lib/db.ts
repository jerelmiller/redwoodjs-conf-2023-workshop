// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'
import { UserInputError } from '@redwoodjs/graphql-server'

import { logger } from './logger'

/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

export const findByUri = (uri: string) => {
  const [type, id] = uri.split(':')

  if (!id) {
    throw new UserInputError(`Malformed URI '${uri}'`)
  }

  switch (type) {
    case 'album':
      return db.album.findUnique({ where: { id } })
    case 'playlist':
      return db.playlist.findUnique({ where: { id } })
    case 'track':
      return db.track.findUnique({ where: { id } })
    default:
      throw new UserInputError(
        `'uri' is not a valid URI: Unknown type '${type}'`
      )
  }
}

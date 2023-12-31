import { TimestampTypeDefinition, TimestampResolver } from 'graphql-scalars'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { authDecoder, getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const handler = createGraphQLHandler({
  authDecoder,
  getCurrentUser,
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  schemaOptions: {
    typeDefs: [TimestampTypeDefinition],
    resolvers: { Timestamp: TimestampResolver },
  },
  armorConfig: {
    maxDepth: { n: 7 },
  },
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})

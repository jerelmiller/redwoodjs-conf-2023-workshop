import fs from 'node:fs'
import path from 'node:path'
import toml from 'toml'
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'
import { encrypt, getSession } from 'src/lib/session'
import { extractCookie, getCookieAttributes } from 'src/lib/cookie'

interface SessionData {
  id: string
}

// How long a user will remain logged in, in seconds
const EXPIRES = 60 * 60 * 24 * 365 * 10 // 10 years

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: auth function`)

  const body = parseBody(event)

  switch (getMethod(event, body)) {
    case 'login':
      return handlers.login()
    case 'logout':
      return handlers.logout()
    case 'getToken':
      return handlers.getToken(event)
    default:
      return {
        statusCode: 404,
      }
  }
}

const handlers = {
  login: async () => {
    const config = toml.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../../workshop.config.toml'),
        'utf-8'
      )
    )

    const user = await db.user.findFirst({
      where: { displayName: config.user.displayName },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRES)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'set-cookie': createSessionCookie({
          data: { id: user.id },
          expires: expiresAt.toUTCString(),
        }),
      },
      body: JSON.stringify(user),
    }
  },
  logout: () => {
    return {
      statusCode: 200,
      headers: {
        'set-cookie': createLogoutCookie(),
      },
    }
  },
  getToken: (event: APIGatewayEvent) => {
    const cookie = extractCookie(event)
    const session = getSession(cookie)

    if (!session) {
      return {
        statusCode: 200,
        headers: {
          'set-cookie': createLogoutCookie(),
        },
      }
    }

    return {
      statusCode: 200,
      body: session.id,
    }
  },
}

const getMethod = (
  event: APIGatewayEvent,
  body: Record<string, any>
): string | undefined => {
  const method = event.queryStringParameters?.method

  if (method) {
    return method
  }

  return body.method
}

const parseBody = (event: APIGatewayEvent): Record<string, unknown> => {
  if (!event.body) {
    return {}
  }

  return JSON.parse(
    event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf-8')
      : event.body
  )
}

const createSessionCookie = ({
  data,
  expires = 'now',
}: {
  data: SessionData
  expires?: 'now' | string
}) => {
  return [`session=${encrypt(data)}`, ...getCookieAttributes({ expires })].join(
    ';'
  )
}

const createLogoutCookie = () => {
  return [`session=`, ...getCookieAttributes({ expires: 'now' })].join(';')
}

const getCurrentUser = async (session: SessionData) => {
  return db.user.findUnique({ where: { id: session.id } })
}

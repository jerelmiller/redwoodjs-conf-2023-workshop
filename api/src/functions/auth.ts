import fs from 'node:fs'
import path from 'node:path'
import toml from 'toml'
import CryptoJS from 'crypto-js'
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'

const COOKIE_OPTS = {
  HttpOnly: true,
  Path: '/',
  SameSite: 'Strict',
  Secure: process.env.NODE_ENV !== 'development',
}

// How long a user will remain logged in, in seconds
const EXPIRES = 60 * 60 * 24 * 365 * 10 // 10 years

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: auth function`)

  const body = parseBody(event)

  switch (getMethod(event, body)) {
    case 'login':
      return login()
    default:
      return {
        statusCode: 404,
      }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'auth function',
    }),
  }
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

const login = async () => {
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
  data: Record<string, any>
  expires?: 'now' | string
}) => {
  const session = JSON.stringify(data)
  const encrypted = encrypt(session)

  const attributes = Object.entries(COOKIE_OPTS)
    .map(([key, value]) => {
      if (value === true) {
        return key
      }

      if (value === false) {
        return null
      }

      return `${key}=${value}`
    })
    .filter(Boolean)

  const expiresAt =
    expires === 'now'
      ? new Date('1970-01-01T00:00:00.000+00:00').toUTCString()
      : expires

  attributes.push(`Expires=${expiresAt}`)

  return [`session=${encrypted}`, ...attributes].join(';')
}

const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, process.env.SESSION_SECRET)
}

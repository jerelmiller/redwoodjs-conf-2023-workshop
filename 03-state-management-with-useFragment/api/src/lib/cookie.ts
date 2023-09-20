import { APIGatewayEvent } from 'aws-lambda'

const COOKIE_OPTS = {
  HttpOnly: true,
  Path: '/',
  SameSite: 'Strict',
  Secure: process.env.NODE_ENV !== 'development',
}

export const extractCookie = (event: APIGatewayEvent) => {
  return event.headers.cookie || event.headers.Cookie
}

export const parseCookieAttributes = (
  cookie: string
): Record<string, unknown> => {
  return Object.fromEntries(
    cookie.split(';').map((entry) => {
      const [key, value] = entry.split('=')

      return [key, value ?? true]
    })
  )
}

export const getCookieAttributes = ({
  expires = 'now',
}: {
  expires?: 'now' | string
}) => {
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

  return attributes
}

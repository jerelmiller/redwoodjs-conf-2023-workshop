import CryptoJS from 'crypto-js'

import { parseCookieAttributes } from './cookie'

export interface SessionData {
  id: string
}

const getSecret = () => {
  const secret = process.env.SESSION_SECRET

  if (!secret) {
    throw new Error(
      'You are missing a `SESSION_SECRET` environment variable. Please generate a secret with `yarn rw g secret` and set this value to `SESSION_SECRET` in the `.env` file at the root of the `00-setup` folder.'
    )
  }

  return secret
}

export const encrypt = (data: SessionData) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), getSecret())
}

export const decrypt = (text: string): SessionData => {
  try {
    const data = CryptoJS.AES.decrypt(text, getSecret()).toString(
      CryptoJS.enc.Utf8
    )

    return JSON.parse(data)
  } catch (e) {
    throw new Error('Cannot decrypt session')
  }
}

export const getSession = (cookie: string | undefined): SessionData | null => {
  if (cookie == null) {
    return null
  }

  const attributes = parseCookieAttributes(cookie)

  return attributes.session ? decrypt(attributes.session as string) : null
}

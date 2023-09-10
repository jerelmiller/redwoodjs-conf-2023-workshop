import CryptoJS from 'crypto-js'

import { parseCookieAttributes } from './cookie'

export interface SessionData {
  id: string
}

export const encrypt = (data: SessionData) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SESSION_SECRET!)
}

export const decrypt = (text: string): SessionData => {
  try {
    const data = CryptoJS.AES.decrypt(
      text,
      process.env.SESSION_SECRET!
    ).toString(CryptoJS.enc.Utf8)

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

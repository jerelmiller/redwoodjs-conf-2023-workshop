import { createAuthentication } from '@redwoodjs/auth'

const TOKEN_CACHE_TIME = 5000

declare global {
  /**
   * URL or absolute path to serverless functions, without the trailing slash.
   * Example: `./redwood/functions`
   */
  const RWJS_API_URL: string
}

const getAuthUrl = () => `${RWJS_API_URL}/auth`

function createAuthClient() {
  let getTokenPromise: Promise<string | null> | null = null
  let lastCheckedAt = new Date('1970-01-01T00:00:00')
  let cachedToken: string | null = null

  const isTokenCacheExpired = () => {
    const now = new Date()
    return now.getTime() - lastCheckedAt.getTime() > TOKEN_CACHE_TIME
  }

  const getToken = async () => {
    if (getTokenPromise) {
      return getTokenPromise
    }

    if (isTokenCacheExpired()) {
      getTokenPromise = fetch(`${getAuthUrl()}?method=getToken`, {
        credentials: 'same-origin',
      })
        .then((res) => res.text())
        .then((token) => {
          lastCheckedAt = new Date()
          cachedToken = token.length === 0 ? null : token

          return cachedToken
        })
        .catch(() => null)
        .finally(() => {
          getTokenPromise = null
        })

      return getTokenPromise
    }

    return cachedToken
  }

  const login = async () => {
    const res = await fetch(getAuthUrl(), {
      credentials: 'same-origin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'login' }),
    })

    return res.json()
  }

  const logout = async () => {
    await fetch(getAuthUrl(), {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({ method: 'logout' }),
    })

    return true
  }

  return {
    type: 'custom-auth',
    login,
    logout,
    getToken,
    signup: () => Promise.reject(new Error('Does not implement sign up')),
    getUserMetadata: getToken,
  }
}

const authClient = createAuthClient()

export const { AuthProvider, useAuth } = createAuthentication(authClient)

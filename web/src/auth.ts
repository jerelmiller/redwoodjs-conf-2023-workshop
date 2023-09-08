import { createAuthentication } from '@redwoodjs/auth'

const TOKEN_CACHE_TIME = 5000

let getTokenPromise: Promise<string | null> | null = null
let lastCheckedAt: Date = new Date('1970-01-01T00:00:00')
let cachedToken: string | null = null

const isTokenCacheExpired = () => {
  const now = new Date()
  return now.getTime() - lastCheckedAt.getTime() > TOKEN_CACHE_TIME
}

// If you're integrating with an auth service provider you should delete this interface.
// Instead you should import the type from their auth client sdk.
export interface AuthClient {
  login: () => Promise<User>
  logout: () => Promise<boolean>
  signup: () => never
  getToken: () => Promise<string | null>
  getUserMetadata: () => User | null
}

interface User {
  id: string
  displayName: string
}

// If you're integrating with an auth service provider you should delete this interface
// This type should be inferred from the general interface above
export interface ValidateResetTokenResponse {
  error?: string
  [key: string]: string | undefined
}

declare global {
  /**
   * URL or absolute path to serverless functions, without the trailing slash.
   * Example: `./redwood/functions`
   */
  const RWJS_API_URL: string
}

const getAuthUrl = () => `${RWJS_API_URL}/auth`

// Replace this with the auth service provider client sdk
const client: AuthClient = {
  login: async () => {
    const res = await fetch(getAuthUrl(), {
      credentials: 'same-origin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'login' }),
    })

    return res.json()
  },
  signup: () => {
    throw new Error('Does not support signup')
  },
  logout: async () => {
    await fetch(getAuthUrl(), {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({ method: 'logout' }),
    })

    return true
  },
  getToken: async () => {
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
        .finally(() => {
          getTokenPromise = null
        })
    }

    return cachedToken
  },
  getUserMetadata: () => ({
    id: 'unique-user-id',
    displayName: 'name',
  }),
}

function createAuth() {
  const authImplementation = createAuthImplementation(client)

  // You can pass custom provider hooks here if you need to as a second
  // argument. See the Redwood framework source code for how that's used
  return createAuthentication(authImplementation)
}

// This is where most of the integration work will take place. You should keep
// the shape of this object (i.e. keep all the key names) but change all the
// values/functions to use methods from the auth service provider client sdk
// you're integrating with
function createAuthImplementation(client: AuthClient) {
  return {
    type: 'custom-auth',
    client,
    login: async () => client.login(),
    logout: async () => client.logout(),
    getToken: async () => client.getToken(),
    signup: () => client.signup(),
    /**
     * Actual user metadata might look something like this
     * {
     *   "id": "11111111-2222-3333-4444-5555555555555",
     *   "aud": "authenticated",
     *   "role": "authenticated",
     *   "roles": ["admin"],
     *   "email": "email@example.com",
     *   "app_metadata": {
     *     "provider": "email"
     *   },
     *   "user_metadata": null,
     *   "created_at": "2016-05-15T19:53:12.368652374-07:00",
     *   "updated_at": "2016-05-15T19:53:12.368652374-07:00"
     * }
     */
    getUserMetadata: async () => client.getUserMetadata(),
  }
}

export const { AuthProvider, useAuth } = createAuth()

import { useEffect } from 'react'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const auth = useAuth()

  useEffect(() => {
    auth.logIn().then(() => {
      window.location.href = routes.home()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default LoginPage

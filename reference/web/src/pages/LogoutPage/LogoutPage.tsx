import { useEffect } from 'react'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const LogoutPage = () => {
  const auth = useAuth()

  useEffect(() => {
    auth.logOut().then(() => {
      window.location.href = routes.home()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default LogoutPage

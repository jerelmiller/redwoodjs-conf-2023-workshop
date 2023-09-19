import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import HomeCell from 'src/components/HomeCell'
import BaseLayout from 'src/layouts/BaseLayout'
import UnauthenticatedLayout from 'src/layouts/UnauthenticatedLayout'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <MetaTags title="Home" description="Home page" />
      {isAuthenticated ? (
        <BaseLayout>
          <HomeCell />
        </BaseLayout>
      ) : (
        <UnauthenticatedLayout />
      )}
    </>
  )
}

export default HomePage

import { MetaTags } from '@redwoodjs/web'

import HomeCell from 'src/components/HomeCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <HomeCell />
    </>
  )
}

export default HomePage

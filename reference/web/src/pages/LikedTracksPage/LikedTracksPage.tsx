import { MetaTags } from '@redwoodjs/web'

import LikedTracksCell from 'src/components/LikedTracksCell'

const LikedTracksPage = () => {
  return (
    <>
      <MetaTags title="LikedTracks" description="LikedTracks page" />
      <LikedTracksCell />
    </>
  )
}

export default LikedTracksPage

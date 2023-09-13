import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const LikedTracksPage = () => {
  return (
    <>
      <MetaTags title="LikedTracks" description="LikedTracks page" />

      <h1>LikedTracksPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/LikedTracksPage/LikedTracksPage.tsx</code>
      </p>
      <p>
        My default route is named <code>likedTracks</code>, link to me with `
        <Link to={routes.likedTracks()}>LikedTracks</Link>`
      </p>
    </>
  )
}

export default LikedTracksPage

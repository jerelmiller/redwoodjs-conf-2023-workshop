import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ArtistPage = () => {
  return (
    <>
      <MetaTags title="Artist" description="Artist page" />

      <h1>ArtistPage</h1>
      <p>
        Find me in <code>./web/src/pages/ArtistPage/ArtistPage.tsx</code>
      </p>
      <p>
        My default route is named <code>artist</code>, link to me with `
        <Link to={routes.artist()}>Artist</Link>`
      </p>
    </>
  )
}

export default ArtistPage

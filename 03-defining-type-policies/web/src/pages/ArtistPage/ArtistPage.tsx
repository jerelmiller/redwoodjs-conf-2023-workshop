import { MetaTags } from '@redwoodjs/web'

import ArtistCell from 'src/components/ArtistCell'

interface ArtistPageProps {
  id: string
}

const ArtistPage = ({ id }: ArtistPageProps) => {
  return (
    <>
      <MetaTags title="Artist" description="Artist page" />
      <ArtistCell id={id} />
    </>
  )
}

export default ArtistPage

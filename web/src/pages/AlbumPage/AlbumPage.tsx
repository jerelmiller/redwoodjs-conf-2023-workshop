import { MetaTags } from '@redwoodjs/web'

import AlbumCell from 'src/components/AlbumCell'

interface AlbumPageProps {
  id: string
}

const AlbumPage = ({ id }: AlbumPageProps) => {
  return (
    <>
      <MetaTags title="Album" description="Album page" />
      <AlbumCell id={id} />
    </>
  )
}

export default AlbumPage

import { MetaTags } from '@redwoodjs/web'

import PlaylistCell from 'src/components/PlaylistCell'

interface PlaylistPageProps {
  id: string
}

const PlaylistPage = ({ id }: PlaylistPageProps) => {
  return (
    <>
      <MetaTags title="Playlist" description="Playlist page" />
      <PlaylistCell id={id} />
    </>
  )
}

export default PlaylistPage

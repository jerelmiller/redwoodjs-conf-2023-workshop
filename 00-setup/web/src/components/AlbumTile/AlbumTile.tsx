import { routes } from '@redwoodjs/router'

import MediaTile from 'src/components/MediaTile'
import MediaTileCoverPhoto from 'src/components/MediaTileCoverPhoto'
import MediaTileTitle from 'src/components/MediaTileTitle'

interface Album {
  id: string
  name: string
  images: Array<{ url: string }>
}

interface AlbumTileProps {
  album: Album
}

const AlbumTile = ({ album }: AlbumTileProps) => {
  return (
    <MediaTile to={routes.album({ id: album.id })}>
      <MediaTileCoverPhoto image={album.images[0]} />
      <div className="flex flex-col">
        <MediaTileTitle>{album.name}</MediaTileTitle>
      </div>
    </MediaTile>
  )
}

export default AlbumTile

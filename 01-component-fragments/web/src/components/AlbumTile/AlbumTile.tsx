import { AlbumType, ReleaseDatePrecision } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import MediaTile from 'src/components/MediaTile'
import MediaTileCoverPhoto from 'src/components/MediaTileCoverPhoto'
import MediaTileDetails from 'src/components/MediaTileDetails'
import MediaTileTitle from 'src/components/MediaTileTitle'
import { capitalize } from 'src/utils/string'

import ReleaseDate from '../ReleaseDate/ReleaseDate'

interface Album {
  id: string
  name: string
  albumType: AlbumType
  releaseDate: {
    date: string
    precision: ReleaseDatePrecision
  }
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
        <MediaTileDetails>
          <span>
            <ReleaseDate releaseDate={album.releaseDate} />
          </span>
          <span>{capitalize(album.albumType.toLowerCase())}</span>
        </MediaTileDetails>
      </div>
    </MediaTile>
  )
}

export default AlbumTile

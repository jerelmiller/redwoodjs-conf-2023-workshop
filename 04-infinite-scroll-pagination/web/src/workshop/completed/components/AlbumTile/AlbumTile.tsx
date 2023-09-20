import { AlbumTile_album } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import MediaTile from 'src/components/MediaTile'
import MediaTileCoverPhoto from 'src/components/MediaTileCoverPhoto'
import MediaTileDetails from 'src/components/MediaTileDetails/MediaTileDetails'
import MediaTileTitle from 'src/components/MediaTileTitle'
import ReleaseDate from 'src/components/ReleaseDate/ReleaseDate'
import { capitalize } from 'src/utils/string'

interface AlbumTileProps {
  album: AlbumTile_album
}

const AlbumTile = ({ album }: AlbumTileProps) => {
  return (
    <MediaTile to={routes.album({ id: album.id })}>
      <MediaTileCoverPhoto image={album.images[0]} />
      <div className="flex flex-col">
        <MediaTileTitle>{album.name}</MediaTileTitle>
        <MediaTileDetails>
          <ReleaseDate releaseDate={album.releaseDate} />
          <span>{capitalize(album.albumType.toLowerCase())}</span>
        </MediaTileDetails>
      </div>
    </MediaTile>
  )
}

AlbumTile.fragments = {
  album: gql`
    fragment AlbumTile_album on Album {
      id
      name
      albumType
      releaseDate {
        date
        precision
      }
      images {
        url
      }
    }
  `,
}

export default AlbumTile

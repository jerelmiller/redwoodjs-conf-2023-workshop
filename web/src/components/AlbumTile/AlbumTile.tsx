import { ReactElement, ReactNode, forwardRef, cloneElement } from 'react'

import { gql } from '@apollo/client'
import cx from 'classnames'
import { AlbumTile_album as Album } from 'types/graphql'

import { Link } from '@redwoodjs/router'

import { fragments } from 'src/apollo/fragmentRegistry'
import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import MediaTile from 'src/components/MediaTile'
import MediaTileCoverPhoto from 'src/components/MediaTileCoverPhoto'
import MediaTileDetails from 'src/components/MediaTileDetails'
import MediaTileTitle from 'src/components/MediaTileTitle'
import { yearOfRelease } from 'src/utils/releaseDate'
import { capitalize } from 'src/utils/string'

interface AlbumTileProps {
  album: Album
}

fragments.register(gql`
  fragment AlbumTile_album on Album {
    id
    name
    albumType
    releaseDate {
      date
    }
    images {
      url
    }
    tracks {
      pageInfo {
        total
      }
    }
  }
`)

const AlbumTile = ({ album }: AlbumTileProps) => {
  return (
    <MediaTile to="/albums/id">
      <MediaTileCoverPhoto image={album.images[0]} />
      <div className="flex flex-col">
        <MediaTileTitle>{album.name}</MediaTileTitle>
        <MediaTileDetails>
          <span>{yearOfRelease(album.releaseDate)}</span>
          <span>{capitalize(album.albumType.toLowerCase())}</span>
        </MediaTileDetails>
      </div>
    </MediaTile>
  )
}

export default AlbumTile

import type { FindAlbumQuery, FindAlbumQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageCoverPhoto from 'src/components/PageCoverPhoto'
import PageHeader from 'src/components/PageHeader'
import PageHeaderDetails from 'src/components/PageHeaderDetails'
import PageMediaType from 'src/components/PageMediaType'
import PageTitle from 'src/components/PageTitle'
import PlayButton from 'src/components/PlayButton'
import ReleaseDate from 'src/components/ReleaseDate'
import Skeleton from 'src/components/Skeleton'
import { yearOfRelease } from 'src/utils/releaseDate'
import { pluralize } from 'src/utils/string'

export const QUERY = gql`
  query FindAlbumQuery($id: ID!) {
    album(id: $id) {
      id
      albumType
      name
      releaseDate {
        date
        precision
      }
      images {
        url
        vibrantColor(alpha: 0.9)
      }
      artists {
        id
        name
      }
      tracks {
        pageInfo {
          total
        }
      }
    }
  }
`

export const Loading = () => {
  return (
    <PageContainer>
      <PageHeader>
        <Skeleton.CoverPhoto size="250px" />
        <div className="flex max-h-[250px] flex-1 flex-col gap-2">
          <Skeleton.Heading level={1} width="50%" fontSize="5rem" />
          <PageHeaderDetails>
            <Skeleton.Text width="20%" />
          </PageHeaderDetails>
        </div>
      </PageHeader>
      <PageContent>
        <div>
          <PlayButton
            disabled
            variant="primary"
            size="3.5rem"
            playing={false}
          />
        </div>
        <Skeleton.Table
          rows={10}
          columns={[
            <Skeleton.Text key="text" />,
            <div key="header" className="flex items-end gap-2">
              <Skeleton.CoverPhoto size="2.5rem" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton.Text width="25%" fontSize="1rem" />
                <Skeleton.Text width="20%" fontSize="0.75rem" />
              </div>
            </div>,
            <Skeleton.Text key="text2" />,
            <Skeleton.Text key="text3" />,
          ]}
        />
      </PageContent>
    </PageContainer>
  )
}

export const Failure = ({
  error,
}: CellFailureProps<FindAlbumQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  album,
}: CellSuccessProps<FindAlbumQuery, FindAlbumQueryVariables>) => {
  const coverPhoto = album.images[0]
  const totalTracks = album.tracks?.pageInfo.total ?? 0

  return (
    <PageContainer bgColor={coverPhoto.vibrantColor}>
      <PageHeader>
        <PageCoverPhoto image={coverPhoto} />
        <div className="flex max-h-[250px] flex-1 flex-col gap-2">
          <PageMediaType mediaType="album" />
          <PageTitle>{album.name}</PageTitle>
          <PageHeaderDetails>
            {album.artists.map((artist) => (
              <Link key={artist.id} to={routes.artist({ id: artist.id })}>
                {artist.name}
              </Link>
            ))}
            <span>{yearOfRelease(album.releaseDate)}</span>
            <span>
              {totalTracks} {pluralize('song', totalTracks)}
            </span>
          </PageHeaderDetails>
        </div>
      </PageHeader>
      <PageContent>
        <div className="flex gap-4">
          <PlayButton variant="primary" size="3.5rem" playing={false} />
        </div>
        {/* <AlbumTracksTable album={album} tracksContains={tracksContains} /> */}
        <div className="flex flex-col">
          <div className="text-sm text-muted">
            <ReleaseDate releaseDate={album.releaseDate} />
          </div>
          {/* album.copyrights.map((copyright) => (
            <span
              key={copyright.text.concat(copyright.type ?? '')}
              className="text-xxs text-muted"
            >
              {copyright.text}
            </span>
          )) */}
        </div>
      </PageContent>
    </PageContainer>
  )
}

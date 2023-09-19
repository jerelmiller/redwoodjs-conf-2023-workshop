import cx from 'classnames'
import { Clock } from 'lucide-react'
import type { FindAlbumQuery, FindAlbumQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageCoverPhoto from 'src/components/PageCoverPhoto'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageHeaderDetails from 'src/components/PageHeaderDetails'
import PageMediaType from 'src/components/PageMediaType'
import PageTitle from 'src/components/PageTitle'
import PlayButton from 'src/components/PlayButton'
import ReleaseDate from 'src/components/ReleaseDate'
import Skeleton from 'src/components/Skeleton'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'
import { yearOfRelease } from 'src/utils/releaseDate'
import { pluralize } from 'src/utils/string'

import Duration from '../Duration'
import LikeButton from '../LikeButton'
import Table from '../Table'
import TableBody from '../TableBody'
import TableCell from '../TableCell'
import TableHead from '../TableHead'
import TableHeader from '../TableHeader'
import TableRow from '../TableRow'
import TrackNumberCell from '../TrackNumberCell'
import TrackTitleTableCell from '../TrackTitleTableCell/TrackTitleTableCell'

export const QUERY = gql`
  query FindAlbumQuery($id: ID!) {
    album(id: $id) {
      id
      albumType
      name
      uri
      releaseDate {
        date
        precision
      }
      images {
        url
        vibrantColor(alpha: 0.9)
      }
      copyrights {
        text
        type
      }
      artists {
        id
        name
      }
      tracks {
        pageInfo {
          total
        }
        edges {
          node {
            id
            durationMs
            explicit
            name
            uri
            artists {
              id
              name
            }
          }
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
  const resumePlayback = useResumePlaybackMutation()
  const coverPhoto = album.images[0]
  const totalTracks = album.tracks?.pageInfo.total ?? 0
  const tracksContains = new Map()

  return (
    <PageContainer bgColor={coverPhoto.vibrantColor}>
      <PageHeader>
        <PageCoverPhoto image={coverPhoto} />
        <PageHeaderContent>
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
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="flex gap-4">
          <PlayButton
            variant="primary"
            size="3.5rem"
            playing={false}
            onClick={() => {
              resumePlayback({
                contextUri: album.uri,
                uri: album.tracks?.edges[0].node.uri,
              })
            }}
          />
        </div>
        <Table>
          <TableHead>
            <TableHeader alignText="right">#</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader />
            <TableHeader alignText="right">
              <Clock size="1rem" />
            </TableHeader>
          </TableHead>
          <TableBody>
            {album.tracks?.edges.map(({ node: track }, index) => {
              const liked = tracksContains.get(track.id) ?? false

              return (
                <TableRow
                  key={track.id}
                  onDoubleClick={() => {
                    resumePlayback({ contextUri: album.uri, uri: track.uri })
                  }}
                >
                  <TableCell shrink>
                    <TrackNumberCell position={index + 1} />
                  </TableCell>
                  <TrackTitleTableCell
                    track={track}
                    includeCoverPhoto={false}
                  />
                  <TableCell shrink>
                    <div className="px-2">
                      <LikeButton
                        liked={liked}
                        size="1rem"
                        className={cx(
                          'relative top-[2px] group-hover:visible',
                          {
                            invisible: !liked,
                          }
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell shrink>
                    <Duration durationMs={track.durationMs} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex flex-col">
          <div className="text-sm text-muted">
            <ReleaseDate releaseDate={album.releaseDate} />
          </div>
          {album.copyrights.map((copyright) => (
            <span
              key={copyright.text.concat(copyright.type ?? '')}
              className="text-xxs text-muted"
            >
              {copyright.text}
            </span>
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}

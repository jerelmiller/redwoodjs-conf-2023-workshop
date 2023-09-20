import { Clock } from 'lucide-react'
import {
  type FindPlaylistQuery,
  type FindPlaylistQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import DateTime from 'src/components/DateTime'
import Duration from 'src/components/Duration'
import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageCoverPhoto from 'src/components/PageCoverPhoto'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageHeaderDetails from 'src/components/PageHeaderDetails'
import PageMediaType from 'src/components/PageMediaType'
import PageTitle from 'src/components/PageTitle'
import PlayButton from 'src/components/PlayButton'
import ScrollableListObserver from 'src/components/ScrollableListObserver'
import Skeleton from 'src/components/Skeleton'
import Table from 'src/components/Table'
import TableBody from 'src/components/TableBody'
import TableCell from 'src/components/TableCell'
import TableHead from 'src/components/TableHead'
import TableHeader from 'src/components/TableHeader'
import TableRow from 'src/components/TableRow'
import TrackNumberTableCell from 'src/components/TrackNumberTableCell'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'
import TrackTitleTableCell from 'src/workshop/components/TrackTitleTableCell'

import LikedTrackTableCell from '../LikedTrackTableCell/LikedTrackTableCell'

export const QUERY = gql`
  query FindPlaylistQuery($id: ID!, $offset: Int = 0) {
    playlist(id: $id) {
      id
      name
      uri
      owner {
        id
        displayName
      }
      images {
        url
        vibrantColor(alpha: 0.9)
      }
      tracks(offset: $offset) {
        pageInfo {
          total
          offset
          limit
          hasNextPage
        }
        edges {
          addedAt
          track: node {
            id
            durationMs
            name
            uri
            album {
              id
              name
              images {
                url
              }
            }
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

export const beforeQuery = (variables: FindPlaylistQueryVariables) => {
  return { fetchPolicy: 'cache-first', variables }
}

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPlaylistQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  playlist,
  queryResult,
}: CellSuccessProps<FindPlaylistQuery, FindPlaylistQueryVariables>) => {
  const resumePlayback = useResumePlaybackMutation()
  const { pageInfo } = playlist.tracks
  const totalTracks = pageInfo.total
  const coverPhoto = playlist.images[0]

  return (
    <PageContainer bgColor={coverPhoto.vibrantColor}>
      <PageHeader>
        <PageCoverPhoto image={playlist.images[0]} />
        <PageHeaderContent>
          <PageMediaType mediaType="playlist" />
          <PageTitle>{playlist.name}</PageTitle>
          <PageHeaderDetails>
            <span className="font-bold">{playlist.owner.displayName}</span>
            <span>
              {totalTracks} {totalTracks === 1 ? 'song' : 'songs'}
            </span>
          </PageHeaderDetails>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div>
          <PlayButton
            playing={false}
            size="3.5rem"
            variant="primary"
            onClick={() => {
              resumePlayback({
                contextUri: playlist.uri,
                uri: playlist.tracks.edges[0].track.uri,
              })
            }}
          />
        </div>
        <Table>
          <TableHead>
            <TableHeader alignText="right">#</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Album</TableHeader>
            <TableHeader>Date added</TableHeader>
            <TableHeader />
            <TableHeader alignText="right">
              <Clock size="1rem" />
            </TableHeader>
          </TableHead>
          <TableBody>
            {playlist.tracks.edges.map(({ addedAt, track }, index) => {
              return (
                <TableRow
                  key={track.id}
                  onDoubleClick={() => {
                    resumePlayback({ contextUri: playlist.uri, uri: track.uri })
                  }}
                >
                  <TrackNumberTableCell position={index + 1} />
                  <TrackTitleTableCell track={track} />
                  <TableCell>
                    <Link
                      className="text-muted transition-colors hover:text-primary"
                      to={routes.album({ id: track.album.id })}
                    >
                      {track.album.name}
                    </Link>
                  </TableCell>
                  <TableCell wrap={false}>
                    {addedAt && (
                      <span className="text-muted">
                        <DateTime
                          date={addedAt}
                          format={DateTime.FORMAT.timeAgo}
                        />
                      </span>
                    )}
                  </TableCell>
                  <LikedTrackTableCell liked={false} track={track} />
                  <TableCell shrink>
                    <Duration durationMs={track.durationMs} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <ScrollableListObserver
          threshold="500px"
          onIntersect={() => {
            const { offset, limit, hasNextPage } = pageInfo

            if (hasNextPage && queryResult?.fetchMore) {
              queryResult.fetchMore({ variables: { offset: offset + limit } })
            }
          }}
        />
      </PageContent>
    </PageContainer>
  )
}

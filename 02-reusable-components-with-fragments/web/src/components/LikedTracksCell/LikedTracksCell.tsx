import { Clock, Music } from 'lucide-react'
import type { LikedTracksQuery, LikedTracksQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import DateTime from 'src/components/DateTime'
import Duration from 'src/components/Duration'
import EmptyState from 'src/components/EmptyState'
import EmptyStateDescription from 'src/components/EmptyStateDescription'
import EmptyStateTitle from 'src/components/EmptyStateTitle'
import LikedTracksCoverPhoto from 'src/components/LikedTracksCoverPhoto'
import LikedTrackTableCell from 'src/components/LikedTrackTableCell'
import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageHeaderDetails from 'src/components/PageHeaderDetails'
import PageMediaType from 'src/components/PageMediaType'
import PagePlayButton from 'src/components/PagePlayButton'
import PageTitle from 'src/components/PageTitle'
import PlayButton from 'src/components/PlayButton'
import Skeleton from 'src/components/Skeleton'
import Table from 'src/components/Table'
import TableBody from 'src/components/TableBody'
import TableCell from 'src/components/TableCell'
import TableHead from 'src/components/TableHead'
import TableHeader from 'src/components/TableHeader'
import TableRow from 'src/components/TableRow'
import TrackNumberTableCell from 'src/components/TrackNumberTableCell'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'
import { pluralize } from 'src/utils/string'
import TrackTitleTableCell from 'src/workshop/components/TrackTitleTableCell'

export const QUERY = gql`
  query LikedTracksQuery {
    me {
      profile {
        id
        displayName
      }
      tracks {
        pageInfo {
          total
        }
        edges {
          addedAt
          node {
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

export const beforeQuery = (variables: LikedTracksQueryVariables) => {
  return { fetchPolicy: 'cache-first', variables }
}

const CONTEXT_URI = 'collection:tracks'

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

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ me }: CellSuccessProps<LikedTracksQuery>) => {
  const resumePlayback = useResumePlaybackMutation()
  const totalTracks = me.tracks?.pageInfo.total ?? 0

  return (
    <PageContainer bgColor="#1F3363">
      <PageHeader>
        <LikedTracksCoverPhoto
          className="shadow-2xl"
          size="250px"
          iconSize="100px"
        />
        <PageHeaderContent>
          <PageMediaType mediaType="playlist" />
          <PageTitle>Liked Songs</PageTitle>
          <PageHeaderDetails>
            <span className="font-bold">{me.profile?.displayName}</span>
            <span>
              {totalTracks} {pluralize('track', totalTracks)}
            </span>
          </PageHeaderDetails>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div>
          <PagePlayButton
            disabled={totalTracks === 0}
            contextUri={CONTEXT_URI}
          />
        </div>
        {totalTracks > 0 ? (
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
              {me.tracks?.edges.map(({ addedAt, node: track }, index) => {
                return (
                  <TableRow
                    key={track.id}
                    onDoubleClick={() => {
                      resumePlayback({
                        contextUri: CONTEXT_URI,
                        uri: track.uri,
                      })
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
                    <TableCell>
                      <span className="text-muted">
                        <DateTime
                          date={addedAt}
                          format={DateTime.FORMAT.timeAgo}
                        />
                      </span>
                    </TableCell>
                    <LikedTrackTableCell liked track={track} />
                    <TableCell shrink>
                      <Duration durationMs={track.durationMs} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>
            <Music size="3rem" className="text-muted" />
            <EmptyStateTitle>Songs you like will appear here</EmptyStateTitle>
            <EmptyStateDescription>
              Save songs by tapping the heart icon.
            </EmptyStateDescription>
          </EmptyState>
        )}
      </PageContent>
    </PageContainer>
  )
}

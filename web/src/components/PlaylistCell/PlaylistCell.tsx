import { createColumnHelper } from '@tanstack/react-table'
import cx from 'classnames'
import { Clock } from 'lucide-react'
import type {
  FindPlaylistQuery,
  FindPlaylistQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useFragment } from '@apollo/client'

import CoverPhoto from 'src/components/CoverPhoto'
import DateTime from 'src/components/DateTime'
import DelimitedList from 'src/components/DelimitedList'
import Duration from 'src/components/Duration'
import ExplicitBadge from 'src/components/ExplicitBadge'
import LikeButton from 'src/components/LikeButton'
import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageCoverPhoto from 'src/components/PageCoverPhoto'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageHeaderDetails from 'src/components/PageHeaderDetails'
import PageMediaType from 'src/components/PageMediaType'
import PageTitle from 'src/components/PageTitle'
import PlayButton from 'src/components/PlayButton'
import Skeleton from 'src/components/Skeleton'
import Table from 'src/components/Table'
import TableBody from 'src/components/TableBody'
import TableHeader from 'src/components/TableHeader'
import TableRow from 'src/components/TableRow'
import TrackNumberColumn from 'src/components/TrackNumberColumn'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import TableCell from '../TableCell/TableCell'

export const QUERY = gql`
  query FindPlaylistQuery($id: ID!) {
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
      tracks {
        pageInfo {
          total
        }
        edges {
          addedAt
          track: node {
            id
            durationMs
            explicit
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

const PLAYBACK_STATE_FRAGMENT = gql`
  fragment PlaylistCell_playbackState on PlaybackState {
    isPlaying
    context {
      uri
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

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPlaylistQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  playlist,
}: CellSuccessProps<FindPlaylistQuery, FindPlaylistQueryVariables>) => {
  const { data: playbackState } = useFragment({
    fragment: PLAYBACK_STATE_FRAGMENT,
    from: { __typename: 'PlaybackState' },
  })
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()
  const totalTracks = playlist.tracks.pageInfo.total
  const coverPhoto = playlist.images[0]
  const isPlaying = playbackState?.isPlaying ?? false
  const isCurrentContext = playbackState?.context?.uri === playlist.uri
  const isPlayingPlaylist = isCurrentContext && isPlaying

  const tracksContains = new Map()

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
            playing={isPlayingPlaylist}
            size="3.5rem"
            variant="primary"
            onClick={() => {
              if (isPlayingPlaylist) {
                pausePlayback()
              } else if (isCurrentContext) {
                resumePlayback()
              } else {
                resumePlayback({
                  contextUri: playlist.uri,
                  uri: playlist.tracks.edges[0].track.uri,
                })
              }
            }}
          />
        </div>
        <Table>
          <thead>
            <TableHeader alignText="right">#</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Album</TableHeader>
            <TableHeader>Date added</TableHeader>
            <TableHeader />
            <TableHeader alignText="right">
              <Clock size="1rem" />
            </TableHeader>
          </thead>
          <TableBody>
            {playlist.tracks.edges.map(({ addedAt, track }, index) => {
              const liked = tracksContains.get(track.id) ?? false

              return (
                <TableRow
                  onDoubleClick={() => {
                    resumePlayback({ contextUri: playlist.uri, uri: track.uri })
                  }}
                >
                  <TableCell shrink>
                    <TrackNumberColumn trackNumber={index + 1} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-end gap-2">
                      <CoverPhoto
                        image={track.album.images.at(-1)}
                        size="2.5rem"
                      />
                      <div className="flex flex-col">
                        <span className="text-base text-primary">
                          {track.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {track.explicit && <ExplicitBadge />}
                          <span className="text-muted">
                            <DelimitedList delimiter=", ">
                              {track.artists.map((artist) => (
                                <Link
                                  key={artist.id}
                                  className="transition-colors duration-150 hover:text-primary"
                                  to={routes.artist({ id: artist.id })}
                                >
                                  {artist.name}
                                </Link>
                              ))}
                            </DelimitedList>
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
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
                  <TableCell shrink>
                    <div className="px-2">
                      <LikeButton
                        liked={liked}
                        size="1rem"
                        className={cx(
                          'relative top-[2px] group-hover:visible',
                          { invisible: !liked }
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
      </PageContent>
    </PageContainer>
  )
}

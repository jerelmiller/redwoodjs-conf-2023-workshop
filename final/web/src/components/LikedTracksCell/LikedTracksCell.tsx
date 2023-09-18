import { useFragment } from '@apollo/client'
import cx from 'classnames'
import { Clock } from 'lucide-react'
import type {
  LikedTracksCellPlaybackStateFragment,
  LikedTracksQuery,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageMediaType from 'src/components/PageMediaType'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

import CoverPhoto from '../CoverPhoto'
import DateTime from '../DateTime'
import DelimitedList from '../DelimitedList'
import Duration from '../Duration'
import ExplicitBadge from '../ExplicitBadge'
import LikeButton from '../LikeButton'
import LikedTracksCoverPhoto from '../LikedTracksCoverPhoto'
import PageContent from '../PageContent'
import PageHeaderDetails from '../PageHeaderDetails'
import PageTitle from '../PageTitle'
import PlayButton from '../PlayButton'
import Table from '../Table'
import TableBody from '../TableBody'
import TableCell from '../TableCell'
import TableHead from '../TableHead'
import TableHeader from '../TableHeader'
import TableRow from '../TableRow'
import TrackNumberCell from '../TrackNumberCell/TrackNumberCell'

export const QUERY = gql`
  query LikedTracksQuery {
    me {
      profile {
        id
        displayName
      }
      tracks {
        edges {
          addedAt
          node {
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
            ...TrackNumberCell_track
          }
        }
      }
    }
  }
`

const PLAYBACK_STATE_FRAGMENT = gql`
  fragment LikedTracksCellPlaybackStateFragment on PlaybackState {
    isPlaying
    context {
      uri
    }
    track {
      id
    }
  }
`

const CONTEXT_URI = 'collection:tracks'

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ me }: CellSuccessProps<LikedTracksQuery>) => {
  const { data: playbackState } =
    useFragment<LikedTracksCellPlaybackStateFragment>({
      fragment: PLAYBACK_STATE_FRAGMENT,
      from: { __typename: 'PlaybackState' },
    })
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()

  const isPlaying = playbackState.isPlaying ?? false
  const isCurrentContext = playbackState.context?.uri === CONTEXT_URI
  const isPlayingLikedTracks = isCurrentContext && isPlaying

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
            <span>1 song</span>
          </PageHeaderDetails>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div>
          <PlayButton
            playing={isPlayingLikedTracks}
            size="3.5rem"
            variant="primary"
            onClick={() => {
              if (isPlayingLikedTracks) {
                pausePlayback()
              } else if (isCurrentContext) {
                resumePlayback()
              } else {
                resumePlayback({
                  contextUri: CONTEXT_URI,
                  uri: me.tracks?.edges[0].node.uri,
                })
              }
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
            {me.tracks?.edges.map(({ addedAt, node: track }, index) => {
              return (
                <TableRow
                  key={track.id}
                  onDoubleClick={() => {
                    resumePlayback({ contextUri: CONTEXT_URI, uri: track.uri })
                  }}
                >
                  <TableCell shrink>
                    <TrackNumberCell track={track} position={index + 1} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-end gap-2">
                      <CoverPhoto
                        image={track.album.images.at(-1)}
                        size="2.5rem"
                      />
                      <div className="flex flex-col">
                        <span
                          className={cx('text-base text-primary', {
                            'text-theme': playbackState.track?.id === track.id,
                          })}
                        >
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
                  <TableCell>
                    <span className="text-muted">
                      <DateTime
                        date={addedAt}
                        format={DateTime.FORMAT.timeAgo}
                      />
                    </span>
                  </TableCell>
                  <TableCell shrink>
                    <div className="px-2">
                      <LikeButton
                        liked
                        size="1rem"
                        className="relative top-[2px]"
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
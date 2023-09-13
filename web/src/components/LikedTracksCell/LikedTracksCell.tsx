import { createColumnHelper } from '@tanstack/react-table'
import { Clock } from 'lucide-react'
import type { LikedTracksQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageHeader from 'src/components/PageHeader'
import PageHeaderContent from 'src/components/PageHeaderContent'
import PageMediaType from 'src/components/PageMediaType'

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
import TrackNumberColumn from '../TrackNumberColumn'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ me }: CellSuccessProps<LikedTracksQuery>) => {
  const spotifyURI = `spotify:user:${me.profile?.id}:collection`

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
          <PlayButton playing={false} size="3.5rem" variant="primary" />
        </div>
        <Table
          data={me.tracks?.edges ?? []}
          columns={columns}
          meta={{ spotifyURI } satisfies LikedTracksTableMeta}
        />
      </PageContent>
    </PageContainer>
  )
}

type SavedTrackEdge = NonNullable<
  NonNullable<LikedTracksQuery['me']>['tracks']
>['edges'][0]

interface LikedTracksTableMeta {
  spotifyURI: string
}

const columnHelper = createColumnHelper<SavedTrackEdge>()

const columns = [
  columnHelper.accessor('node', {
    id: 'number',
    header: '#',
    cell: (info) => {
      return <TrackNumberColumn trackNumber={info.row.index + 1} />
    },
    meta: {
      headerAlign: 'right',
      shrink: true,
    },
  }),
  columnHelper.accessor('node', {
    id: 'title',
    header: 'Title',
    cell: (info) => {
      const track = info.getValue()
      const coverPhoto = track.album.images.at(-1)

      return (
        <div className="flex items-end gap-2">
          <CoverPhoto image={coverPhoto} size="2.5rem" />
          <div className="flex flex-col">
            <span className="text-base text-primary">{track.name}</span>
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
      )
    },
  }),
  columnHelper.accessor('node.album', {
    header: 'Album',
    cell: (info) => {
      const album = info.getValue()

      return (
        <Link
          className="text-muted transition-colors hover:text-primary"
          to={routes.album({ id: album.id })}
        >
          {album.name}
        </Link>
      )
    },
  }),
  columnHelper.accessor('addedAt', {
    header: 'Date added',
    cell: (info) => (
      <span className="text-muted">
        <DateTime date={info.getValue()} format={DateTime.FORMAT.timeAgo} />
      </span>
    ),
  }),
  columnHelper.accessor('node', {
    id: 'likeButton',
    header: '',
    cell: () => {
      return (
        <div className="px-2">
          <LikeButton liked size="1rem" className="relative top-[2px]" />
        </div>
      )
    },
    meta: {
      shrink: true,
    },
  }),
  columnHelper.accessor('node.durationMs', {
    header: () => <Clock size="1rem" />,
    cell: (info) => <Duration durationMs={info.getValue()} />,
    meta: {
      headerAlign: 'right',
      shrink: true,
    },
  }),
]

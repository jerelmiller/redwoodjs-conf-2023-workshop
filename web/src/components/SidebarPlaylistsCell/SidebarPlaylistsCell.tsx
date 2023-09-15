import { Volume2 } from 'lucide-react'
import type { SidebarPlaylistsQuery } from 'types/graphql'

import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import SidebarPlaylistContent from 'src/components/SidebarPlaylistContent'
import SidebarPlaylistLink from 'src/components/SidebarPlaylistLink'
import SidebarPlaylistName from 'src/components/SidebarPlaylistName'
import Skeleton from 'src/components/Skeleton'
import { randomBetween, range } from 'src/utils/common'

export const QUERY = gql`
  query SidebarPlaylistsQuery {
    me {
      playlists {
        edges {
          node {
            id
            name
            images {
              url
            }
            owner {
              id
              displayName
            }
          }
        }
      }
    }
  }
`

export const Loading = () => {
  const skeletons = range(0, randomBetween(5, 8))

  return skeletons.map((num) => (
    <li key={num} className="px-0 py-2">
      <div className="flex gap-2">
        <Skeleton.CoverPhoto size="3rem" />
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton.Text width={`${randomBetween(40, 60)}%`} fontSize="1rem" />
          <Skeleton.Text
            width={`${randomBetween(50, 70)}%`}
            fontSize="0.75rem"
          />
        </div>
      </div>
    </li>
  ))
}

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ me }: CellSuccessProps<SidebarPlaylistsQuery>) => {
  const isCurrentContext = false
  const playbackState = { isPlaying: false }

  return me?.playlists?.edges?.map(({ node: playlist }) => {
    return (
      <SidebarPlaylistLink
        key={playlist.id}
        to={routes.playlist({ id: playlist.id })}
      >
        <CoverPhoto image={playlist.images.at(-1)} size="48px" />
        <SidebarPlaylistContent>
          <SidebarPlaylistName>{playlist.name}</SidebarPlaylistName>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">
              <DelimitedList delimiter=" · ">
                <span>Playlist</span>
                <span>{playlist.owner.displayName}</span>
              </DelimitedList>
            </span>
          </div>
        </SidebarPlaylistContent>
        {isCurrentContext && playbackState?.isPlaying && (
          <Volume2 color="var(--color--theme--light)" size="0.875rem" />
        )}
      </SidebarPlaylistLink>
    )
  })
}

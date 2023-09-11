import cx from 'classnames'
import { Pin, Volume2 } from 'lucide-react'
import type { SidebarPlaylistsQuery } from 'types/graphql'

import { NavLink, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import { thumbnail } from 'src/utils/image'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ me }: CellSuccessProps<SidebarPlaylistsQuery>) => {
  const isCurrentContext = false
  const pinned = false
  const playbackState = { isPlaying: false }

  return (
    <ul>
      {me.playlists?.edges?.map(({ node: playlist }) => {
        return (
          <li key={playlist.id}>
            <NavLink
              to={routes.playlist({ id: playlist.id })}
              className="transition-color block justify-between rounded-md py-2 pl-2 pr-4 leading-none transition-colors duration-200 ease-out hover:bg-[#1A1A1A] hover:no-underline"
              activeClassName="bg-surface text-primary hover:bg-[#393939]"
            >
              <div className="flex items-center gap-3">
                <CoverPhoto image={thumbnail(playlist.images)} />
                <div className="flex flex-1 flex-col justify-around self-stretch overflow-hidden text-ellipsis whitespace-nowrap">
                  <div
                    className={cx(
                      'overflow-hidden text-ellipsis whitespace-nowrap',
                      { 'text-theme-light': isCurrentContext }
                    )}
                  >
                    {playlist.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {pinned && (
                      <Pin
                        fill="currentColor"
                        size="1rem"
                        strokeWidth={1}
                        className="rotate-45 text-theme-light"
                      />
                    )}
                    <span className="text-sm text-muted">
                      <DelimitedList delimiter=" · ">
                        <span>Playlist</span>
                        <span>{playlist.owner.displayName}</span>
                      </DelimitedList>
                    </span>
                  </div>
                </div>
                {isCurrentContext && playbackState?.isPlaying && (
                  <Volume2 color="var(--color--theme--light)" size="0.875rem" />
                )}
              </div>
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

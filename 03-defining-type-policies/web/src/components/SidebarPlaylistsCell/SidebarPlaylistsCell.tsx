import { type SidebarPlaylistsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import SidebarPlaylistItem from 'src/components/SidebarPlaylistItem'
import Skeleton from 'src/components/Skeleton'
import { randomBetween, range } from 'src/utils/common'

export const QUERY = gql`
  query SidebarPlaylistsQuery {
    me {
      playlists {
        edges {
          node {
            id
            ...SidebarPlaylistItem_playlist
          }
        }
      }
    }
  }

  ${SidebarPlaylistItem.fragments.playlist}
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
  return me?.playlists?.edges?.map(({ node: playlist }) => {
    return <SidebarPlaylistItem key={playlist.id} playlist={playlist} />
  })
}

import type { SidebarPlaylistsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query SidebarPlaylistsQuery {
    sidebarPlaylists {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  sidebarPlaylists,
}: CellSuccessProps<SidebarPlaylistsQuery>) => {
  return (
    <ul>
      {sidebarPlaylists.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}

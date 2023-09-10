import type {
  CurrentUserMenuQuery,
  CurrentUserMenuQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Avatar from 'src/components/Avatar'
import DropdownMenu from 'src/components/DropdownMenu'
import Skeleton from 'src/components/Skeleton'

export const QUERY = gql`
  query CurrentUserMenuQuery {
    me {
      profile {
        id
        displayName
      }
    }
  }
`
export const Loading = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton.Avatar size="2rem" />
      <Skeleton.Text width="10ch" />
    </div>
  )
}

export const Empty = () => null

export const Failure = ({
  error,
}: CellFailureProps<CurrentUserMenuQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<CurrentUserMenuQuery, CurrentUserMenuQueryVariables>) => {
  const { profile } = me

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        className="!bg-black-pure py-[0.125rem] pl-[0.125rem] pr-2 !text-sm normal-case tracking-normal hover:bg-surface aria-expanded:bg-surface"
        variant="ghost"
        size="sm"
      >
        <Avatar size="2rem" imageUrl="nope" />
        {profile?.displayName ?? 'RedwoodJS Workshop'}
      </DropdownMenu.Trigger>
      <DropdownMenu.Menu align="end">
        <DropdownMenu.Item to="/logout">Logout</DropdownMenu.Item>
      </DropdownMenu.Menu>
    </DropdownMenu>
  )
}

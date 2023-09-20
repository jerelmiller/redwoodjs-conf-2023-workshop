import type {
  CurrentUserMenuQuery,
  CurrentUserMenuQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Avatar from 'src/components/Avatar'
import DropdownMenu from 'src/components/DropdownMenu'
import Skeleton from 'src/components/Skeleton'
import { thumbnail } from 'src/utils/image'

export const QUERY = gql`
  query CurrentUserMenuQuery {
    me {
      profile {
        id
        displayName
        images {
          __typename
          url
        }
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
  const image = thumbnail(profile?.images ?? [])

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        className="!bg-black-pure py-[0.125rem] pl-[0.125rem] pr-2 !text-sm normal-case tracking-normal hover:bg-surface aria-expanded:bg-surface"
        variant="ghost"
        size="sm"
      >
        {image && <Avatar size="2rem" imageUrl={image.url} />}
        {profile?.displayName ?? 'RedwoodJS Workshop'}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item to="/logout">Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

import type {
  CurrentUserMenuQuery,
  CurrentUserMenuQueryVariables,
} from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query CurrentUserMenuQuery {
    me {
      profile {
        id
        displayName
        ...Avatar_profile
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<CurrentUserMenuQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<CurrentUserMenuQuery, CurrentUserMenuQueryVariables>) => {
  return <div>{JSON.stringify(me)}</div>
}

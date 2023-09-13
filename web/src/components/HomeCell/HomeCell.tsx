import type { HomeQuery, HomeQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query HomeQuery {
    albums(limit: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<HomeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  home,
}: CellSuccessProps<HomeQuery, HomeQueryVariables>) => {
  return <div>{JSON.stringify(home)}</div>
}

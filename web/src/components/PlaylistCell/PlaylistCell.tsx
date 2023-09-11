import type {
  FindPlaylistQuery,
  FindPlaylistQueryVariables,
} from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageHeader from 'src/components/PageHeader'
import PageTitle from 'src/components/PageTitle'

export const QUERY = gql`
  query FindPlaylistQuery($id: ID!) {
    playlist(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPlaylistQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  playlist,
}: CellSuccessProps<FindPlaylistQuery, FindPlaylistQueryVariables>) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Playlist</PageTitle>
      </PageHeader>
      <PageContent>
        <p>
          Find me in <code>./web/src/pages/PlaylistPage/PlaylistPage.tsx</code>
        </p>
      </PageContent>
    </PageContainer>
  )
}

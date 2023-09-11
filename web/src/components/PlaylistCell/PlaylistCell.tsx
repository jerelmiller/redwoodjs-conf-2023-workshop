import type {
  FindPlaylistQuery,
  FindPlaylistQueryVariables,
} from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageContainer from 'src/components/PageContainer'
import PageCoverPhoto from 'src/components/PageCoverPhoto'
import PageContent from 'src/components/PageContent'
import PageHeader from 'src/components/PageHeader'
import PageTitle from 'src/components/PageTitle'
import PlayButton from '../PlayButton/PlayButton'

export const QUERY = gql`
  query FindPlaylistQuery($id: ID!) {
    playlist(id: $id) {
      id
      name
      images {
        url
      }
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
        <PageCoverPhoto image={playlist.images[0]} />
        <PageTitle>{playlist.name}</PageTitle>
      </PageHeader>
      <PageContent>
        <div>
          <PlayButton playing={false} size="3.5rem" variant="primary" />
        </div>
      </PageContent>
    </PageContainer>
  )
}

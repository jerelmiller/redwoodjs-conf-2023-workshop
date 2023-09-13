import type { HomeQuery, HomeQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AlbumTile from 'src/components/AlbumTile'
import TileGrid from 'src/components/TileGrid'

export const QUERY = gql`
  query HomeQuery {
    albums(limit: 10) {
      edges {
        node {
          id
          ...AlbumTile_album
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
  albums,
}: CellSuccessProps<HomeQuery, HomeQueryVariables>) => {
  return (
    <div className="flex-1 bg-black-base p-[var(--main-content--padding)]">
      <h1 className="mb-8 text-5xl">Dive into something new</h1>
      <TileGrid gap="2.5rem 1rem" minTileWidth="200px">
        {albums.edges.map(({ node }) => (
          <AlbumTile key={node.id} album={node} />
        ))}
      </TileGrid>
    </div>
  )
}

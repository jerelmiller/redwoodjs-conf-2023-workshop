import type { HomeQuery, HomeQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AlbumTile from 'src/components/AlbumTile'
import TileGrid from 'src/components/TileGrid'

const getTileLimit = () => {
  const width = window.innerWidth

  switch (true) {
    case width > 2500:
      return 9
    case width > 2100:
      return 8
    case width > 1990:
      return 7
    case width > 1750:
      return 6
    default:
      return 5
  }
}

export const beforeQuery = () => {
  return {
    variables: { limit: getTileLimit() },
  }
}

export const QUERY = gql`
  query HomeQuery($limit: Int) {
    albums(limit: $limit) {
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

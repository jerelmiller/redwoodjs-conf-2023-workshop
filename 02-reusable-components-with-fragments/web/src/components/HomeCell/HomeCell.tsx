import { useState } from 'react'

import type { HomeQuery, HomeQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AlbumTile from 'src/components/AlbumTile'
import TileGrid from 'src/components/TileGrid'

const matchesWidth = (width: number) =>
  window.matchMedia(`(min-width: ${width}px)`).matches

const getTileLimit = () => {
  switch (true) {
    case matchesWidth(2500):
      return 9
    case matchesWidth(2100):
      return 8
    case matchesWidth(1990):
      return 7
    case matchesWidth(1750):
      return 6
    default:
      return 4
  }
}

export const beforeQuery = () => {
  return {
    variables: { limit: getTileLimit() },
  }
}

export const QUERY = gql`
  query HomeQuery($limit: Int) {
    me {
      albums(limit: $limit) {
        edges {
          node {
            ...HomeQueryAlbumFragment
          }
        }
      }
    }
    albums(limit: 20) {
      edges {
        node {
          ...HomeQueryAlbumFragment
        }
      }
    }
  }

  fragment HomeQueryAlbumFragment on Album {
    id
    name
    albumType
    releaseDate {
      date
      precision
    }
    images {
      url
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<HomeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
  albums,
}: CellSuccessProps<HomeQuery, HomeQueryVariables>) => {
  const [limit] = useState(() => getTileLimit())
  const savedAlbumEdges = me.albums?.edges ?? []
  const savedIds = savedAlbumEdges.map((edge) => edge.node.id)
  const albumEdges = albums.edges ?? []

  // Filter out saved albums from list
  const nonSavedAlbumEdges = albumEdges
    .filter((edge) => !savedIds.includes(edge.node.id))
    .slice(0, limit)

  return (
    <>
      <div className="flex-1 bg-black-base p-[var(--main-content--padding)]">
        {savedAlbumEdges.length > 0 && (
          <>
            <h1 className="text-5xl">Revisit a classic</h1>
            <TileGrid gap="1rem" minTileWidth="200px">
              {savedAlbumEdges.map(({ node }) => (
                <AlbumTile key={node.id} album={node} />
              ))}
            </TileGrid>
          </>
        )}

        <h1 className="mt-10 text-5xl">Dive into something new</h1>
        <TileGrid gap="2.5rem 1rem" minTileWidth="200px">
          {nonSavedAlbumEdges.map(({ node }) => (
            <AlbumTile key={node.id} album={node} />
          ))}
        </TileGrid>
      </div>
    </>
  )
}

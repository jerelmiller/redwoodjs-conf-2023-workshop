import cx from 'classnames'
import type { FindArtistQuery, FindArtistQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import AlbumTile from 'src/components/AlbumTile'
import PageContainer from 'src/components/PageContainer'
import PageContent from 'src/components/PageContent'
import PageTitle from 'src/components/PageTitle'
import TileGrid from 'src/components/TileGrid'

export const QUERY = gql`
  query FindArtistQuery($id: ID!) {
    artist(id: $id) {
      id
      followerCount
      name
      albums(includeTypes: [ALBUM]) {
        ...ArtistRouteQuery_albums
      }

      singles: albums(includeTypes: [SINGLE]) {
        ...ArtistRouteQuery_albums
      }

      compilations: albums(includeTypes: [COMPILATION]) {
        ...ArtistRouteQuery_albums
      }

      images {
        url
      }
    }
  }

  fragment ArtistRouteQuery_albums on ArtistAlbumsConnection {
    edges {
      node {
        id
        name
        ...AlbumTile_album
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindArtistQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  artist,
}: CellSuccessProps<FindArtistQuery, FindArtistQueryVariables>) => {
  const image = artist.images[0]

  return (
    <PageContainer>
      <header
        className={cx(
          'relative mt-[calc(-1*var(--main-header--height))] flex h-[40vh] flex-col items-start justify-end gap-4 bg-cover bg-no-repeat p-[var(--main-content--padding)] pt-[var(--main-header--height)] [background-position:50%_15%] [&>*]:z-[1]',
          'before:absolute before:inset-0 before:[background:linear-gradient(rgba(0,0,0,0)_-30%,#181818)]'
        )}
        style={{ backgroundImage: image && `url(${image.url})` }}
      >
        <PageTitle>{artist.name}</PageTitle>
        <span>
          {new Intl.NumberFormat().format(artist.followerCount)} followers
        </span>
      </header>
      <PageContent gap="2rem">
        <AlbumSection
          title="Albums"
          albums={artist.albums?.edges.map((edge) => edge.node) ?? []}
        />
        <AlbumSection
          title="Singles and EPs"
          albums={artist.singles?.edges.map((edge) => edge.node) ?? []}
        />
        <AlbumSection
          title="Compilations"
          albums={artist.compilations?.edges.map((edge) => edge.node) ?? []}
        />
      </PageContent>
    </PageContainer>
  )
}

type Album = NonNullable<
  NonNullable<FindArtistQuery['artist']>['albums']
>['edges'][0]['node']

interface AlbumSectionProps {
  albums: Album[]
  title: string
}

const AlbumSection = ({ albums, title }: AlbumSectionProps) => {
  if (albums.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <h2>{title}</h2>
      <TileGrid gap="1rem" minTileWidth="200px">
        {albums.map((album) => (
          <AlbumTile key={album.id} album={album} />
        ))}
      </TileGrid>
    </section>
  )
}

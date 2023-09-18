import {
  CurrentTrackDetailsCellQuery,
  CurrentTrackDetailsCellQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { CellSuccessProps } from '@redwoodjs/web'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import LikeButton from 'src/components/LikeButton'
import Skeleton from 'src/components/Skeleton/Skeleton'

export const QUERY = gql`
  query CurrentTrackDetailsCellQuery {
    me {
      player {
        playbackState {
          track {
            id
            name
            album {
              id
              images {
                url
              }
            }
            artists {
              id
              name
            }
          }
        }
      }
    }
  }
`

export const Loading = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton.CoverPhoto size="4rem" />
      <div className="flex flex-col gap-2">
        <Skeleton.Text width="4rem" />
        <Skeleton.Text width="8rem" />
      </div>
      <LikeButton disabled liked={false} />
    </div>
  )
}

export const Success = ({
  me,
}: CellSuccessProps<
  CurrentTrackDetailsCellQuery,
  CurrentTrackDetailsCellQueryVariables
>) => {
  const currentTrack = me.player.playbackState?.track

  return (
    <div className="flex items-center gap-4">
      <CoverPhoto size="4rem" image={currentTrack?.album.images[0]} />
      {currentTrack && (
        <>
          <div className="flex flex-col gap-1">
            <Link
              className="text-sm"
              to={routes.album({ id: currentTrack.album.id })}
            >
              {currentTrack.name}
            </Link>
            <span className="text-xs text-muted">
              <DelimitedList className="text-xs text-muted" delimiter=", ">
                {currentTrack.artists.map((artist) => (
                  <Link key={artist.id} to={routes.artist({ id: artist.id })}>
                    {artist.name}
                  </Link>
                ))}
              </DelimitedList>
            </span>
          </div>
          <LikeButton liked={false} size="1.25rem" />
        </>
      )}
    </div>
  )
}

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
import { useContainsSavedTracks } from 'src/hooks/useContainsSavedTracks'
import { useRemoveSavedTrackMutation } from 'src/mutations/useRemoveSavedTrackMutation'
import { useSaveTrackMutation } from 'src/mutations/useSaveTrackMutation'

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
  const saveTrack = useSaveTrackMutation()
  const removeSavedTrack = useRemoveSavedTrackMutation()
  const currentTrack = me.player.playbackState?.track
  const contains = useContainsSavedTracks(currentTrack ? [currentTrack.id] : [])
  const liked = currentTrack ? contains.get(currentTrack.id) ?? false : false

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
          <LikeButton
            liked={liked}
            size="1.25rem"
            onClick={() => {
              if (liked) {
                removeSavedTrack({ id: currentTrack.id })
              } else {
                saveTrack({ id: currentTrack.id })
              }
            }}
          />
        </>
      )}
    </div>
  )
}

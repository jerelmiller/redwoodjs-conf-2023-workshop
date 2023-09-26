import { CurrentTrackDetailsCell_track } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import CoverPhoto from 'src/components/CoverPhoto'
import DelimitedList from 'src/components/DelimitedList'
import LikeButton from 'src/components/LikeButton'
import { useRemoveSavedTrackMutation } from 'src/mutations/useRemoveSavedTrackMutation'
import { useSaveTrackMutation } from 'src/mutations/useSaveTrackMutation'

interface CurrentTrackDetailsCellProps {
  track: CurrentTrackDetailsCell_track | null | undefined
}

const CurrentTrackDetailsCell = ({ track }: CurrentTrackDetailsCellProps) => {
  const saveTrack = useSaveTrackMutation()
  const removeSavedTrack = useRemoveSavedTrackMutation()
  // Don't use useContainsSavedTracks for this exercise to better illustrate
  // playback state
  const contains = new Map()
  const liked = track ? contains.get(track.id) ?? false : false

  return (
    <div className="flex items-center gap-4">
      <CoverPhoto size="4rem" image={track?.album.images[0]} />
      {track && (
        <>
          <div className="flex flex-col gap-1">
            <Link className="text-sm" to={routes.album({ id: track.album.id })}>
              {track.name}
            </Link>
            <span className="text-xs text-muted">
              <DelimitedList className="text-xs text-muted" delimiter=", ">
                {track.artists.map((artist) => (
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
                removeSavedTrack({ id: track.id })
              } else {
                saveTrack({ id: track.id })
              }
            }}
          />
        </>
      )}
    </div>
  )
}

CurrentTrackDetailsCell.fragments = {
  track: gql`
    fragment CurrentTrackDetailsCell_track on Track {
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
  `,
}

export default CurrentTrackDetailsCell

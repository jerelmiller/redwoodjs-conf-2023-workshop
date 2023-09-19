import { useFragment } from '@apollo/client'
import {
  TrackNumberCellPlaybackState,
  TrackNumberCell_track,
} from 'types/graphql'

import { fragments } from 'src/apollo/fragmentRegistry'

import AnimatedSoundWave from '../AnimatedSoundWave/AnimatedSoundWave'

interface TrackNumberCellProps {
  track: TrackNumberCell_track
  position: number
}

fragments.register(gql`
  fragment TrackNumberCell_track on Track {
    id
    uri
  }
`)

const PLAYBACK_STATE_FRAGMENT = gql`
  fragment TrackNumberCellPlaybackState on PlaybackState {
    isPlaying
    context {
      uri
    }
    track {
      id
    }
  }
`

const TrackNumberCell = ({ position, track }: TrackNumberCellProps) => {
  const { data: playbackState } = useFragment<TrackNumberCellPlaybackState>({
    fragment: PLAYBACK_STATE_FRAGMENT,
    from: { __typename: 'PlaybackState' },
  })

  const isCurrent = playbackState?.track?.id === track.id
  const isCurrentlyPlaying = isCurrent && playbackState.isPlaying

  return (
    <div className="flex min-w-[3ch] justify-end">
      <span className="tabular-nums text-muted">
        {isCurrentlyPlaying ? <AnimatedSoundWave /> : position}
      </span>
    </div>
  )
}

export default TrackNumberCell

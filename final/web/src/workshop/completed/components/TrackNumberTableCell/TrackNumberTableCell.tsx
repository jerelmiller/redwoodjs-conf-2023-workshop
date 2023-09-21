import { TypedDocumentNode, useFragment } from '@apollo/client'
import { TrackNumberTableCell_playbackState } from 'types/graphql'

import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import TableCell from 'src/components/TableCell'

interface TrackNumberTableCellProps {
  position: number
  trackId: string
}

const PLAYBACK_STATE_FRAGMENT: TypedDocumentNode<TrackNumberTableCell_playbackState> = gql`
  fragment TrackNumberTableCell_playbackState on PlaybackState {
    isPlaying
    track {
      id
    }
  }
`

const TrackNumberTableCell = ({
  position,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackId,
}: TrackNumberTableCellProps) => {
  const { data: playbackState } = useFragment({
    fragment: PLAYBACK_STATE_FRAGMENT,
    from: { __typename: 'PlaybackState' },
  })

  const isPlaying = playbackState.isPlaying ?? false
  const isCurrentTrack = playbackState.track?.id === trackId
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  return (
    <TableCell shrink>
      <div className="flex min-w-[3ch] justify-end">
        <span className="tabular-nums text-muted">
          {isCurrentlyPlaying ? <AnimatedSoundWave /> : position}
        </span>
      </div>
    </TableCell>
  )
}

export default TrackNumberTableCell

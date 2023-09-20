import { Shuffle } from 'lucide-react'
import { ShuffleControlCell_playbackState } from 'types/graphql'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import { useShufflePlaybackMutation } from 'src/mutations/useShufflePlaybackMutation'

interface ShuffleControlCellProps {
  playbackState: ShuffleControlCell_playbackState | null | undefined
}

const ShuffleControlCell = ({ playbackState }: ShuffleControlCellProps) => {
  const shufflePlayback = useShufflePlaybackMutation()
  const shuffled = playbackState?.shuffleState

  return (
    <PlaybarControlButton
      active={shuffled}
      disabled={!playbackState}
      tooltip="Enable shuffle"
      onClick={() => shufflePlayback({ state: !shuffled })}
    >
      <Shuffle size="1.25rem" />
    </PlaybarControlButton>
  )
}

ShuffleControlCell.fragments = {
  playbackState: gql`
    fragment ShuffleControlCell_playbackState on PlaybackState {
      shuffleState
    }
  `,
}

export default ShuffleControlCell

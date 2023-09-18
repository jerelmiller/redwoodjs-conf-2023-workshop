import { Shuffle } from 'lucide-react'

import { useShufflePlaybackMutation } from 'src/mutations/useShufflePlaybackMutation'

import PlaybarControlButton from '../PlaybarControlButton'

interface ShuffleControlProps {
  disabled?: boolean
  shuffled: boolean
}

const ShuffleControl = ({ disabled, shuffled }: ShuffleControlProps) => {
  const shufflePlayback = useShufflePlaybackMutation()

  return (
    <PlaybarControlButton
      active={shuffled}
      disabled={disabled}
      tooltip="Enable shuffle"
      onClick={() => shufflePlayback(!shuffled)}
    >
      <Shuffle size="1.25rem" />
    </PlaybarControlButton>
  )
}

export default ShuffleControl

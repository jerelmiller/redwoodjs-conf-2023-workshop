import { ElementType } from 'react'

import { Repeat, Repeat1 } from 'lucide-react'
import { RepeatControlCell_playbackState, RepeatMode } from 'types/graphql'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import { useSetRepeatModeMutation } from 'src/mutations/useSetRepeatModeMutation'

const TOOLTIP: Record<RepeatMode, string> = {
  OFF: 'Enable repeat',
  CONTEXT: 'Enable repeat one',
  TRACK: 'Disable repeat',
} as const

const NEXT_REPEAT_MODE: Record<RepeatMode, RepeatMode> = {
  ['OFF']: 'CONTEXT',
  ['CONTEXT']: 'TRACK',
  ['TRACK']: 'OFF',
} as const

const REPEAT_ICON: Record<RepeatMode, ElementType> = {
  OFF: Repeat,
  CONTEXT: Repeat,
  TRACK: Repeat1,
}

interface RepeatControlCellProps {
  playbackState: RepeatControlCell_playbackState | null | undefined
}

const RepeatControlCell = ({ playbackState }: RepeatControlCellProps) => {
  const setRepeatMode = useSetRepeatModeMutation()
  const repeatState = playbackState?.repeatState ?? 'OFF'
  const RepeatIcon = REPEAT_ICON[repeatState]

  return (
    <PlaybarControlButton
      active={repeatState !== 'OFF'}
      disabled={!playbackState}
      tooltip={TOOLTIP[repeatState]}
      onClick={() => setRepeatMode({ state: NEXT_REPEAT_MODE[repeatState] })}
    >
      <RepeatIcon />
    </PlaybarControlButton>
  )
}

RepeatControlCell.fragments = {
  playbackState: gql`
    fragment RepeatControlCell_playbackState on PlaybackState {
      repeatState
    }
  `,
}

export default RepeatControlCell

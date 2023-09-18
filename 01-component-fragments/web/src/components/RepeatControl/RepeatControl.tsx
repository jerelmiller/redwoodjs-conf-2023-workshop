import { ElementType } from 'react'

import { Repeat, Repeat1 } from 'lucide-react'
import { RepeatMode } from 'types/graphql'

import { useSetRepeatModeMutation } from 'src/mutations/useSetRepeatModeMutation'

import PlaybarControlButton from '../PlaybarControlButton'

interface RepeatControlProps {
  disabled?: boolean
  repeatState: RepeatMode
}

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

const RepeatControl = ({ disabled, repeatState }: RepeatControlProps) => {
  const setRepeatMode = useSetRepeatModeMutation()
  const RepeatIcon = REPEAT_ICON[repeatState]

  return (
    <PlaybarControlButton
      active={repeatState !== 'OFF'}
      disabled={disabled}
      tooltip={TOOLTIP[repeatState]}
      onClick={() => setRepeatMode(NEXT_REPEAT_MODE[repeatState])}
    >
      <RepeatIcon />
    </PlaybarControlButton>
  )
}

export default RepeatControl

import { ElementType } from 'react'

import { Repeat, Repeat1 } from 'lucide-react'
import {
  RepeatControlCellQuery,
  RepeatControlCellQueryVariables,
  RepeatMode,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import { useSetRepeatModeMutation } from 'src/mutations/useSetRepeatModeMutation'

export const QUERY = gql`
  query RepeatControlCellQuery {
    me {
      player {
        playbackState {
          repeatState
        }
      }
    }
  }
`

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

export const Loading = () => {
  return (
    <PlaybarControlButton disabled tooltip={TOOLTIP.OFF}>
      <Repeat />
    </PlaybarControlButton>
  )
}

type RepeatControlCellProps = CellSuccessProps<
  RepeatControlCellQuery,
  RepeatControlCellQueryVariables
>

export const Success = ({ me }: RepeatControlCellProps) => {
  const setRepeatMode = useSetRepeatModeMutation()
  const playbackState = me.player.playbackState
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

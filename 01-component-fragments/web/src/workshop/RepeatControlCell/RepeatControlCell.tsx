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

export const Success = ({
  me,
}: CellSuccessProps<
  RepeatControlCellQuery,
  RepeatControlCellQueryVariables
>) => {
  const setRepeatMode = useSetRepeatModeMutation()
  const repeatState = me.player.playbackState?.repeatState ?? 'OFF'
  const RepeatIcon = REPEAT_ICON[repeatState]

  return (
    <PlaybarControlButton
      active={repeatState !== 'OFF'}
      tooltip={TOOLTIP[repeatState]}
      onClick={() => setRepeatMode(NEXT_REPEAT_MODE[repeatState])}
    >
      <RepeatIcon />
    </PlaybarControlButton>
  )
}

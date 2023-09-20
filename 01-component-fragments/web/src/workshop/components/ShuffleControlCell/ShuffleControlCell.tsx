import { Shuffle } from 'lucide-react'
import {
  ShuffleControlCellQuery,
  ShuffleControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import { useShufflePlaybackMutation } from 'src/mutations/useShufflePlaybackMutation'

export const QUERY = gql`
  query ShuffleControlCellQuery {
    me {
      player {
        playbackState {
          shuffleState
        }
      }
    }
  }
`

export const Loading = () => {
  return (
    <PlaybarControlButton disabled tooltip="Enable shuffle">
      <Shuffle size="1.25rem" />
    </PlaybarControlButton>
  )
}

type ShuffleControlCellProps = CellSuccessProps<
  ShuffleControlCellQuery,
  ShuffleControlCellQueryVariables
>

export const Success = ({ me }: ShuffleControlCellProps) => {
  const shufflePlayback = useShufflePlaybackMutation()
  const playbackState = me.player.playbackState
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

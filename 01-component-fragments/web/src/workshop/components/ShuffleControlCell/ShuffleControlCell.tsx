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

export const Success = ({
  me,
}: CellSuccessProps<
  ShuffleControlCellQuery,
  ShuffleControlCellQueryVariables
>) => {
  const shufflePlayback = useShufflePlaybackMutation()
  const shuffled = me.player.playbackState?.shuffleState

  return (
    <PlaybarControlButton
      active={shuffled}
      tooltip="Enable shuffle"
      onClick={() => shufflePlayback(!shuffled)}
    >
      <Shuffle size="1.25rem" />
    </PlaybarControlButton>
  )
}

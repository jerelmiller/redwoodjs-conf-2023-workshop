import { Volume2 } from 'lucide-react'
import {
  MuteControlCellQuery,
  MuteControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybarControlButton from 'src/components/PlaybarControlButton'

export const QUERY = gql`
  query MuteControlCellQuery {
    me {
      player {
        playbackState {
          device {
            id
            volumePercent
          }
        }
      }
    }
  }
`

export const Loading = () => {
  return (
    <PlaybarControlButton disabled tooltip="Mute">
      <Volume2 />
    </PlaybarControlButton>
  )
}

export const Success = ({
  me,
}: CellSuccessProps<MuteControlCellQuery, MuteControlCellQueryVariables>) => {
  return (
    <PlaybarControlButton
      tooltip={
        me.player.playbackState?.device.volumePercent === 0 ? 'Unmute' : 'Mute'
      }
    >
      <Volume2 />
    </PlaybarControlButton>
  )
}

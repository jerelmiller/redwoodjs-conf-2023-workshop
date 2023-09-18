import { Volume2 } from 'lucide-react'
import {
  MuteControlCellQuery,
  MuteControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import { useSetVolumeMutation } from 'src/mutations/useSetVolumeMutation'

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
  const setVolume = useSetVolumeMutation()
  const volumePercent = me.player.playbackState?.device.volumePercent ?? 0

  return (
    <PlaybarControlButton
      tooltip={volumePercent === 0 ? 'Unmute' : 'Mute'}
      onClick={() =>
        setVolume({ volumePercent: volumePercent === 0 ? 100 : 0 })
      }
    >
      <Volume2 />
    </PlaybarControlButton>
  )
}

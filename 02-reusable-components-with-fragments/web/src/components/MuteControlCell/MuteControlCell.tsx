import { VolumeX } from 'lucide-react'
import {
  MuteControlCellQuery,
  MuteControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import PlaybarControlButton from 'src/components/PlaybarControlButton'
import VolumeIcon from 'src/components/VolumeIcon'
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
      <VolumeX />
    </PlaybarControlButton>
  )
}

export const Success = ({
  me,
}: CellSuccessProps<MuteControlCellQuery, MuteControlCellQueryVariables>) => {
  const setVolume = useSetVolumeMutation()
  const activeDevice = me.player.playbackState?.device
  const volumePercent = activeDevice?.volumePercent ?? 0

  return (
    <PlaybarControlButton
      disabled={!activeDevice}
      tooltip={volumePercent === 0 ? 'Unmute' : 'Mute'}
      onClick={() =>
        setVolume({ volumePercent: volumePercent === 0 ? 100 : 0 })
      }
    >
      <VolumeIcon volumePercent={volumePercent} />
    </PlaybarControlButton>
  )
}

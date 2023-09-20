import {
  VolumeBarControlCellQuery,
  VolumeBarControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import ProgressBar from 'src/components/ProgressBar'
import { useSetVolumeMutation } from 'src/mutations/useSetVolumeMutation'

export const QUERY = gql`
  query VolumeBarControlCellQuery {
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
  return <ProgressBar animate={false} value={100} max={100} width="100px" />
}

export const Success = ({
  me,
}: CellSuccessProps<
  VolumeBarControlCellQuery,
  VolumeBarControlCellQueryVariables
>) => {
  const setVolume = useSetVolumeMutation()
  const activeDevice = me.player.playbackState?.device

  return (
    <ProgressBar
      animate={false}
      disabled={!activeDevice}
      value={activeDevice?.volumePercent ?? 0}
      max={100}
      width="100px"
      onChange={(volumePercent) => {
        if (activeDevice) {
          setVolume({ volumePercent })
        }
      }}
    />
  )
}

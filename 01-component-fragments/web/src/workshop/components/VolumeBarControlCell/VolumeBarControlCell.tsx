import {
  VolumeBarControlCellQuery,
  VolumeBarControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import ProgressBar from 'src/components/ProgressBar'

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
  return (
    <ProgressBar
      animate={false}
      value={me.player.playbackState?.device.volumePercent ?? 0}
      max={100}
      width="100px"
    />
  )
}

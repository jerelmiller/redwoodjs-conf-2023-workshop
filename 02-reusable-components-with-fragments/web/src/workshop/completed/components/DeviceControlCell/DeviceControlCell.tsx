import {
  DeviceControlCellQuery,
  DeviceControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import DeviceIcon from 'src/components/DeviceIcon'
import PlaybarControlButton from 'src/components/PlaybarControlButton'
import Popover from 'src/components/Popover'
import DevicePopoverContentCell from 'src/workshop/completed/components/DevicePopoverContentCell'

export const QUERY = gql`
  query DeviceControlCellQuery {
    me {
      player {
        playbackState {
          device {
            id
            type
          }
        }
      }
    }
  }
`
export const Loading = () => {
  return (
    <PlaybarControlButton tooltip="Connect to a device">
      <DeviceIcon deviceType="computer" strokeWidth={1.5} />
    </PlaybarControlButton>
  )
}

export const Success = ({
  me,
}: CellSuccessProps<
  DeviceControlCellQuery,
  DeviceControlCellQueryVariables
>) => {
  return (
    <Popover content={<DevicePopoverContentCell />}>
      <PlaybarControlButton tooltip="Connect to a device">
        <DeviceIcon
          deviceType={me.player.playbackState?.device.type}
          strokeWidth={1.5}
        />
      </PlaybarControlButton>
    </Popover>
  )
}

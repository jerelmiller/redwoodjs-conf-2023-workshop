import {
  DeviceControlCell_activeDevice,
  DeviceControlCell_devices,
  DeviceControlCell_playbackState,
} from 'types/graphql'

import DeviceIcon from 'src/components/DeviceIcon'
import PlaybarControlButton from 'src/components/PlaybarControlButton'
import Popover from 'src/components/Popover'
import DevicePopoverContentCell from 'src/workshop/completed/components/DevicePopoverContentCell'

interface DevicePopoverCellProps {
  activeDevice: DeviceControlCell_activeDevice | null | undefined
  devices: DeviceControlCell_devices[]
  playbackState: DeviceControlCell_playbackState | null | undefined
}

const DeviceControlCell = ({
  activeDevice,
  devices,
  playbackState,
}: DevicePopoverCellProps) => {
  return (
    <Popover
      content={
        <DevicePopoverContentCell
          activeDevice={activeDevice}
          devices={devices}
          playbackState={playbackState}
        />
      }
    >
      <PlaybarControlButton tooltip="Connect to a device">
        <DeviceIcon deviceType={activeDevice?.type} strokeWidth={1.5} />
      </PlaybarControlButton>
    </Popover>
  )
}

DeviceControlCell.fragments = {
  activeDevice: gql`
    fragment DeviceControlCell_activeDevice on Device {
      id
      type
      ...DevicePopoverContentCell_activeDevice
    }

    ${DevicePopoverContentCell.fragments.activeDevice}
  `,
  devices: gql`
    fragment DeviceControlCell_devices on Device {
      ...DevicePopoverContentCell_devices
    }

    ${DevicePopoverContentCell.fragments.devices}
  `,
  playbackState: gql`
    fragment DeviceControlCell_playbackState on PlaybackState {
      ...DevicePopoverContentCell_playbackState
    }

    ${DevicePopoverContentCell.fragments.playbackState}
  `,
}

export default DeviceControlCell

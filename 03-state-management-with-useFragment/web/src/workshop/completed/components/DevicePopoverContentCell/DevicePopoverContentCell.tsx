import {
  DevicePopoverContentCell_activeDevice,
  DevicePopoverContentCell_devices,
  DevicePopoverContentCell_playbackState,
} from 'types/graphql'

import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import DeviceIcon from 'src/components/DeviceIcon'

interface DevicePopoverContentCellProps {
  activeDevice: DevicePopoverContentCell_activeDevice | null | undefined
  devices: DevicePopoverContentCell_devices[]
  playbackState: DevicePopoverContentCell_playbackState | null | undefined
}

const DevicePopoverContentCell = ({
  activeDevice,
  devices,
  playbackState,
}: DevicePopoverContentCellProps) => {
  const availableDevices = devices.filter(
    (device) => device.id !== playbackState?.device.id
  )

  return (
    <div>
      {activeDevice && (
        <div className="flex items-center gap-4 p-4">
          {playbackState?.isPlaying ? (
            <AnimatedSoundWave size="1.5rem" />
          ) : (
            <DeviceIcon
              deviceType={activeDevice.type}
              className="text-green"
              size="1.5rem"
            />
          )}
          <div className="flex flex-col">
            <h3 className="text-base font-bold">Current device</h3>
            <span className="text-sm text-green-light">
              {activeDevice.name}
            </span>
          </div>
        </div>
      )}
      {availableDevices.length > 0 && (
        <h4 className="my-2 px-4">Select another device</h4>
      )}
      <ul className="flex list-none flex-col">
        {availableDevices.map((device) => (
          <li key={device.id}>
            <button className="flex w-full cursor-pointer items-center gap-4 rounded p-4 text-sm hover:bg-white/10">
              <DeviceIcon deviceType={device.type} strokeWidth={1.5} />
              {device.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

DevicePopoverContentCell.fragments = {
  activeDevice: gql`
    fragment DevicePopoverContentCell_activeDevice on Device {
      id
      name
      type
    }
  `,
  devices: gql`
    fragment DevicePopoverContentCell_devices on Device {
      id
      name
      type
    }
  `,
  playbackState: gql`
    fragment DevicePopoverContentCell_playbackState on PlaybackState {
      isPlaying
      device {
        id
      }
    }
  `,
}

export default DevicePopoverContentCell

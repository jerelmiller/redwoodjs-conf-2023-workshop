import {
  DevicePopoverContentCellQuery,
  DevicePopoverContentCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import DeviceIcon from 'src/components/DeviceIcon'

export const QUERY = gql`
  query DevicePopoverContentCellQuery {
    me {
      player {
        devices {
          id
          name
          type
        }
        playbackState {
          isPlaying
          device {
            id
          }
        }
      }
    }
  }
`

export const Success = ({
  me,
}: CellSuccessProps<
  DevicePopoverContentCellQuery,
  DevicePopoverContentCellQueryVariables
>) => {
  const playbackState = me.player.playbackState
  const activeDevice = me.player.devices.find(
    (device) => device.id === playbackState?.device.id
  )
  const availableDevices = me.player.devices.filter(
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

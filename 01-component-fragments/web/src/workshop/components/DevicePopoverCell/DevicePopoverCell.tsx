import { ReactNode } from 'react'

import { Laptop2 } from 'lucide-react'
import {
  DevicePopoverCellQuery,
  DevicePopoverCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import AnimatedSoundWave from 'src/components/AnimatedSoundWave'
import PlaybarControlButton from 'src/components/PlaybarControlButton'
import Popover from 'src/components/Popover'

export const QUERY = gql`
  query DevicePopoverCellQuery {
    me {
      player {
        devices {
          id
          name
          type
          volumePercent
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

export const Loading = () => {
  return (
    <PlaybarControlButton disabled tooltip="Connect to a device">
      <Laptop2 strokeWidth={1.5} />
    </PlaybarControlButton>
  )
}

export const Success = ({
  me,
  children,
}: CellSuccessProps<DevicePopoverCellQuery, DevicePopoverCellQueryVariables> & {
  children?: ReactNode
}) => {
  const playbackState = me.player.playbackState
  const activeDevice = me.player.devices.find(
    (device) => device.id === playbackState?.device.id
  )
  const availableDevices = me.player.devices.filter(
    (device) => device.id !== playbackState?.device.id
  )

  return (
    <Popover
      content={
        <div>
          {activeDevice && (
            <div className="flex items-center gap-4 p-4">
              {playbackState?.isPlaying ? (
                <AnimatedSoundWave size="1.5rem" />
              ) : (
                <Laptop2 size="1.5rem" className="text-green" />
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
                  <Laptop2 strokeWidth={1.5} />
                  {device.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {children}
    </Popover>
  )
}

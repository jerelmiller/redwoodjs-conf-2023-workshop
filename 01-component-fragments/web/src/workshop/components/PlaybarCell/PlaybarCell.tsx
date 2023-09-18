import cx from 'classnames'
import { Volume1 } from 'lucide-react'
import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import LikeButton from 'src/components/LikeButton'
import QueueControl from 'src/components/QueueControl'
import Skeleton from 'src/components/Skeleton'
import SkipToNextControl from 'src/components/SkipToNextControl'
import SkipToPreviousControl from 'src/components/SkipToPreviousControl'
import CurrentTrackDetailsCell from 'src/workshop/components/CurrentTrackDetailsCell'
import DeviceControlCell from 'src/workshop/components/DeviceControlCell'
import MuteControlCell from 'src/workshop/components/MuteControlCell'
import PlaybackProgressBarCell from 'src/workshop/components/PlaybackProgressBarCell'
import PlayControlCell from 'src/workshop/components/PlayControlCell'
import RepeatControlCell from 'src/workshop/components/RepeatControlCell'
import ShuffleControlCell from 'src/workshop/components/ShuffleControlCell'
import VolumeBarControlCell from 'src/workshop/components/VolumeBarControlCell'

export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        devices {
          id
          name
        }
        playbackState {
          device {
            id
          }
        }
      }
    }
  }
`

export const Loading = () => (
  <footer className="flex flex-col [grid-area:playbar]">
    <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-5 text-primary">
      <div className="flex items-center gap-4">
        <Skeleton.CoverPhoto size="4rem" />
        <div className="flex flex-col gap-2">
          <Skeleton.Text width="4rem" />
          <Skeleton.Text width="8rem" />
        </div>
        <LikeButton disabled liked={false} />
      </div>
    </div>
  </footer>
)

export const Empty = () => null

export const Failure = ({ error }: CellFailureProps<PlaybarQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<PlaybarQuery, PlaybarQueryVariables>) => {
  const playbackState = me.player.playbackState

  const activeDevice = me.player.devices.find(
    (device) => device.id === playbackState?.device.id
  )

  return (
    <footer className="flex flex-col [grid-area:playbar]">
      <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
        <CurrentTrackDetailsCell />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-5">
            <ShuffleControlCell />
            <SkipToPreviousControl />
            <PlayControlCell />
            <SkipToNextControl />
            <RepeatControlCell />
          </div>

          <PlaybackProgressBarCell />
        </div>
        <div className="flex items-center justify-end gap-4">
          <QueueControl />
          <DeviceControlCell />

          <div className="flex items-center gap-1">
            <MuteControlCell />
            <VolumeBarControlCell />
          </div>
        </div>
      </div>
      {activeDevice && (
        <div
          className={cx(
            'flex items-center justify-end',
            'before:[--arrow-size:0.625rem]',
            'border-solid before:border-b-green before:border-l-transparent before:border-r-transparent before:[border-bottom-width:var(--arrow-size)] before:[border-left-width:var(--arrow-size)] before:[border-right-width:var(--arrow-size)]',
            'relative rounded bg-green px-6 py-1 text-sm leading-none',
            'pointer-events-none before:absolute before:right-[10.5rem] before:top-0 before:-translate-y-full'
          )}
        >
          <Volume1 size="1.125rem" /> Listening on {activeDevice.name}
        </div>
      )}
    </footer>
  )
}

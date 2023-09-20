import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ActiveDeviceBannerCell from 'src/components/ActiveDeviceBannerCell'
import LikeButton from 'src/components/LikeButton'
import MuteControlCell from 'src/components/MuteControlCell'
import PlaybackProgressBarCell from 'src/components/PlaybackProgressBarCell'
import QueueControl from 'src/components/QueueControl'
import Skeleton from 'src/components/Skeleton'
import SkipToNextControl from 'src/components/SkipToNextControl'
import SkipToPreviousControl from 'src/components/SkipToPreviousControl'
import VolumeBarControlCell from 'src/components/VolumeBarControlCell'
import CurrentTrackDetailsCell from 'src/workshop/completed/components/CurrentTrackDetailsCell'
import DeviceControlCell from 'src/workshop/completed/components/DeviceControlCell'
import PlayControlCell from 'src/workshop/completed/components/PlayControlCell'
import RepeatControlCell from 'src/workshop/completed/components/RepeatControlCell'
import ShuffleControlCell from 'src/workshop/completed/components/ShuffleControlCell'

export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        devices {
          ...DeviceControlCell_devices
        }
        playbackState {
          context {
            uri
          }
          ...DeviceControlCell_playbackState
          ...PlaybackProgressBarCell_playbackState
          ...PlayControlCell_playbackState
          ...ShuffleControlCell_playbackState
          ...RepeatControlCell_playbackState
          device {
            ...ActiveDeviceBannerCell_activeDevice
            ...DeviceControlCell_activeDevice
            ...MuteControlCell_activeDevice
            ...VolumeBarControlCell_activeDevice
          }
          track {
            ...CurrentTrackDetailsCell_track
          }
        }
      }
    }
  }

  ${ActiveDeviceBannerCell.fragments.activeDevice}
  ${CurrentTrackDetailsCell.fragments.track}
  ${DeviceControlCell.fragments.activeDevice}
  ${DeviceControlCell.fragments.devices}
  ${DeviceControlCell.fragments.playbackState}
  ${MuteControlCell.fragments.device}
  ${PlaybackProgressBarCell.fragments.playbackState}
  ${PlayControlCell.fragments.playbackState}
  ${RepeatControlCell.fragments.playbackState}
  ${ShuffleControlCell.fragments.playbackState}
  ${VolumeBarControlCell.fragments.activeDevice}
`

export const beforeQuery = (variables: PlaybarQueryVariables) => {
  return { fetchPolicy: 'cache-first', variables }
}

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
  const { playbackState } = me.player

  return (
    <footer className="flex flex-col [grid-area:playbar]">
      <div className="grid grid-cols-[30%_1fr_30%] items-center px-6 py-4 text-primary">
        <CurrentTrackDetailsCell track={playbackState?.track} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-5">
            <ShuffleControlCell playbackState={playbackState} />
            <SkipToPreviousControl />
            <PlayControlCell playbackState={playbackState} />
            <SkipToNextControl />
            <RepeatControlCell playbackState={playbackState} />
          </div>

          <PlaybackProgressBarCell playbackState={playbackState} />
        </div>
        <div className="flex items-center justify-end gap-4">
          <QueueControl />
          <DeviceControlCell
            activeDevice={playbackState?.device}
            devices={me.player.devices}
            playbackState={playbackState}
          />

          <div className="flex items-center gap-1">
            <MuteControlCell activeDevice={playbackState?.device} />
            <VolumeBarControlCell activeDevice={playbackState?.device} />
          </div>
        </div>
      </div>
      <ActiveDeviceBannerCell activeDevice={playbackState?.device} />
    </footer>
  )
}

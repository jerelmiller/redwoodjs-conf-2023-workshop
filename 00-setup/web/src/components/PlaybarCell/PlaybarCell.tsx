import type { PlaybarQuery, PlaybarQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ActiveDeviceBannerCell from 'src/components/ActiveDeviceBannerCell'
import CurrentTrackDetailsCell from 'src/components/CurrentTrackDetailsCell'
import DeviceControlCell from 'src/components/DeviceControlCell'
import LikeButton from 'src/components/LikeButton'
import MuteControlCell from 'src/components/MuteControlCell'
import PlaybackProgressBarCell from 'src/components/PlaybackProgressBarCell'
import PlayControlCell from 'src/components/PlayControlCell'
import QueueControl from 'src/components/QueueControl'
import RepeatControlCell from 'src/components/RepeatControlCell'
import ShuffleControlCell from 'src/components/ShuffleControlCell'
import Skeleton from 'src/components/Skeleton'
import SkipToNextControl from 'src/components/SkipToNextControl'
import SkipToPreviousControl from 'src/components/SkipToPreviousControl'
import VolumeBarControlCell from 'src/components/VolumeBarControlCell'

export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        __typename
      }
    }
  }
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
  me: _me,
}: CellSuccessProps<PlaybarQuery, PlaybarQueryVariables>) => {
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
      <ActiveDeviceBannerCell />
    </footer>
  )
}

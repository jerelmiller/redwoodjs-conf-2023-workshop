import {
  PlayControlCellQuery,
  PlayControlCellQueryVariables,
} from 'types/graphql'

import { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

import PlayButton from 'src/components/PlayButton'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

export const QUERY = gql`
  query PlayControlCellQuery {
    me {
      player {
        playbackState {
          isPlaying
        }
      }
    }
  }
`
export const Loading = () => {
  return (
    <PlayButton disabled size="2.5rem" playing={false} variant="secondary" />
  )
}

export const Failure = ({
  error,
}: CellFailureProps<PlayControlCellQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  me,
}: CellSuccessProps<PlayControlCellQuery, PlayControlCellQueryVariables>) => {
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()
  const isPlaying = me.player.playbackState?.isPlaying ?? false

  return (
    <PlayButton
      size="2.5rem"
      playing={isPlaying}
      variant="secondary"
      onClick={() => {
        isPlaying ? pausePlayback() : resumePlayback()
      }}
    />
  )
}

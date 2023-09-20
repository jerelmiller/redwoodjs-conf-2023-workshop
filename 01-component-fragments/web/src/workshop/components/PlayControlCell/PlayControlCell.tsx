import {
  PlayControlCellQuery,
  PlayControlCellQueryVariables,
} from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

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

type PlayControlCellProps = CellSuccessProps<
  PlayControlCellQuery,
  PlayControlCellQueryVariables
>

export const Success = ({ me }: PlayControlCellProps) => {
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()
  const playbackState = me.player.playbackState
  const isPlaying = playbackState?.isPlaying ?? false

  return (
    <PlayButton
      disabled={!playbackState}
      size="2.5rem"
      playing={isPlaying}
      variant="secondary"
      onClick={() => {
        isPlaying ? pausePlayback() : resumePlayback()
      }}
    />
  )
}

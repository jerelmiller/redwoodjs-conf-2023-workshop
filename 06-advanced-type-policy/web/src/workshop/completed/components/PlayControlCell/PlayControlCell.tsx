import { PlayControlCell_playbackState } from 'types/graphql'

import PlayButton from 'src/components/PlayButton'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

interface PlayControlCellProps {
  playbackState: PlayControlCell_playbackState | null | undefined
}

const PlayControlCell = ({ playbackState }: PlayControlCellProps) => {
  const resumePlayback = useResumePlaybackMutation()
  const pausePlayback = usePausePlaybackMutation()
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

PlayControlCell.fragments = {
  playbackState: gql`
    fragment PlayControlCell_playbackState on PlaybackState {
      isPlaying
    }
  `,
}

export default PlayControlCell

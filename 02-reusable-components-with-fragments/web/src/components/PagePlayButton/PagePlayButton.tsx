import PlayButton from 'src/components/PlayButton'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

interface PagePlayButtonProps {
  disabled?: boolean
  contextUri: string
}

const PagePlayButton = ({ disabled, contextUri }: PagePlayButtonProps) => {
  const pausePlayback = usePausePlaybackMutation()
  const resumePlayback = useResumePlaybackMutation()
  const isPlaying = false
  const isCurrentContext = false
  const isPlayingInContext = isPlaying && isCurrentContext

  return (
    <PlayButton
      disabled={disabled}
      variant="primary"
      size="3.5rem"
      playing={isPlayingInContext}
      onClick={() => {
        if (isPlayingInContext) {
          pausePlayback()
        } else if (isCurrentContext) {
          resumePlayback()
        } else {
          resumePlayback({ contextUri })
        }
      }}
    />
  )
}

export default PagePlayButton

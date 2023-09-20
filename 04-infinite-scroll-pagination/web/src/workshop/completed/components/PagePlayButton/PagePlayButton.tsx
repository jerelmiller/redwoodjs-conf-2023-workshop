import { TypedDocumentNode, useFragment } from '@apollo/client'
import { PagePlayButton_playbackState } from 'types/graphql'

import PlayButton from 'src/components/PlayButton'
import { usePausePlaybackMutation } from 'src/mutations/usePausePlaybackMutation'
import { useResumePlaybackMutation } from 'src/mutations/useResumePlaybackMutation'

interface PagePlayButtonProps {
  disabled?: boolean
  contextUri: string
}

const PLAYBACK_STATE_FRAGMENT: TypedDocumentNode<PagePlayButton_playbackState> = gql`
  fragment PagePlayButton_playbackState on PlaybackState {
    isPlaying
    context {
      uri
    }
  }
`

const PagePlayButton = ({ disabled, contextUri }: PagePlayButtonProps) => {
  const { data: playbackState } = useFragment({
    fragment: PLAYBACK_STATE_FRAGMENT,
    from: { __typename: 'PlaybackState' },
  })

  const pausePlayback = usePausePlaybackMutation()
  const resumePlayback = useResumePlaybackMutation()
  const isPlaying = playbackState.isPlaying ?? false
  const isCurrentContext = playbackState.context?.uri === contextUri

  return (
    <PlayButton
      disabled={disabled}
      variant="primary"
      size="3.5rem"
      playing={isPlaying}
      onClick={() => {
        if (isPlaying && isCurrentContext) {
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

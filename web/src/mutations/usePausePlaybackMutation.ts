import { useMutation } from '@redwoodjs/web'
import { useCallback } from 'react'

const PAUSE_PLAYBACK_MUTATION = gql`
  mutation PausePlaybackMutation {
    pausePlayback {
      playbackState {
        isPlaying
      }
    }
  }
`

export const usePausePlaybackMutation = () => {
  const [execute] = useMutation(PAUSE_PLAYBACK_MUTATION)

  return useCallback(() => {
    return execute()
  }, [execute])
}

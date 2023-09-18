import { useCallback } from 'react'

import { useMutation } from '@redwoodjs/web'

const PAUSE_PLAYBACK_MUTATION = gql`
  mutation PausePlaybackMutation {
    pausePlayback {
      playbackState {
        isPlaying
        progressMs
        timestamp
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

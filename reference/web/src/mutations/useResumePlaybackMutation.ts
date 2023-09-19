import { useCallback } from 'react'

import {
  ResumePlaybackInput,
  ResumePlaybackMutation,
  ResumePlaybackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const RESUME_PLAYBACK_MUTATION = gql`
  mutation ResumePlaybackMutation($input: ResumePlaybackInput) {
    resumePlayback(input: $input) {
      playbackState {
        isPlaying
        progressMs
        timestamp
        context {
          uri
        }
        track {
          id
        }
      }
    }
  }
`
export const useResumePlaybackMutation = () => {
  const [execute] = useMutation<
    ResumePlaybackMutation,
    ResumePlaybackMutationVariables
  >(RESUME_PLAYBACK_MUTATION)

  return useCallback(
    (input?: ResumePlaybackInput) => {
      return execute({ variables: { input } })
    },
    [execute]
  )
}

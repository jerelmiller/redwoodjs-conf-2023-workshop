import {
  ResumePlaybackInput,
  ResumePlaybackMutation,
  ResumePlaybackMutationVariables,
} from 'types/graphql'
import { useMutation } from '@redwoodjs/web'
import { useCallback } from 'react'

const RESUME_PLAYBACK_MUTATION = gql`
  mutation ResumePlaybackMutation($input: ResumePlaybackInput) {
    resumePlayback(input: $input) {
      playbackState {
        isPlaying
      }
    }
  }
`
export const useResumePlaybackMutation = () => {
  const [execute] = useMutation<
    ResumePlaybackMutation,
    ResumePlaybackMutationVariables
  >(RESUME_PLAYBACK_MUTATION)

  const resumePlayback = useCallback(
    (input?: ResumePlaybackInput) => {
      return execute({ variables: { input } })
    },
    [execute]
  )

  return [resumePlayback] as const
}

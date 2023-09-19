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
        shuffleState
        repeatState
        device {
          id
          name
          type
          volumePercent
        }
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
      return execute({
        variables: { input },
        update: (cache, { data }) => {
          if (!data?.resumePlayback?.playbackState) {
            return
          }

          cache.modify({
            id: cache.identify({ __typename: 'Player' }),
            fields: {
              playbackState: (_, { toReference }) => {
                return toReference({ __typename: 'PlaybackState' }) ?? null
              },
            },
          })
        },
      })
    },
    [execute]
  )
}

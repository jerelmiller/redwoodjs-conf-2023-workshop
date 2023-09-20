import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import {
  ShufflePlaybackInput,
  ShufflePlaybackMutation,
  ShufflePlaybackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SHUFFLE_PLAYBACK_MUTATION: TypedDocumentNode<
  ShufflePlaybackMutation,
  ShufflePlaybackMutationVariables
> = gql`
  mutation ShufflePlaybackMutation($input: ShufflePlaybackInput!) {
    shufflePlayback(input: $input) {
      playbackState {
        shuffleState
      }
    }
  }
`

export const useShufflePlaybackMutation = () => {
  const [execute] = useMutation(SHUFFLE_PLAYBACK_MUTATION)

  return useCallback(
    (input: ShufflePlaybackInput) => {
      return execute({ variables: { input } })
    },
    [execute]
  )
}

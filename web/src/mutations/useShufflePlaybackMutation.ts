import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import {
  ShufflePlaybackMutation,
  ShufflePlaybackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SHUFFLE_PLAYBACK_MUTATION: TypedDocumentNode<
  ShufflePlaybackMutation,
  ShufflePlaybackMutationVariables
> = gql`
  mutation ShufflePlaybackMutation($state: Boolean!) {
    shufflePlayback(state: $state) {
      playbackState {
        shuffleState
      }
    }
  }
`

export const useShufflePlaybackMutation = () => {
  const [execute] = useMutation(SHUFFLE_PLAYBACK_MUTATION)

  return useCallback(
    (shuffled: boolean) => {
      return execute({ variables: { state: shuffled } })
    },
    [execute]
  )
}

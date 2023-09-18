import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import {
  RepeatMode,
  SetRepeatModeMutation,
  SetRepeatModeMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SET_REPEAT_MODE_MUTATION: TypedDocumentNode<
  SetRepeatModeMutation,
  SetRepeatModeMutationVariables
> = gql`
  mutation SetRepeatModeMutation($state: RepeatMode!) {
    setRepeatMode(state: $state) {
      playbackState {
        repeatState
      }
    }
  }
`

export const useSetRepeatModeMutation = () => {
  const [execute] = useMutation(SET_REPEAT_MODE_MUTATION)

  return useCallback(
    (state: RepeatMode) => {
      return execute({ variables: { state } })
    },
    [execute]
  )
}

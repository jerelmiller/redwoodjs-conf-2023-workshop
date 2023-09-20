import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import {
  SetRepeatModeInput,
  SetRepeatModeMutation,
  SetRepeatModeMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SET_REPEAT_MODE_MUTATION: TypedDocumentNode<
  SetRepeatModeMutation,
  SetRepeatModeMutationVariables
> = gql`
  mutation SetRepeatModeMutation($input: SetRepeatModeInput!) {
    setRepeatMode(input: $input) {
      playbackState {
        repeatState
      }
    }
  }
`

export const useSetRepeatModeMutation = () => {
  const [execute] = useMutation(SET_REPEAT_MODE_MUTATION)

  return useCallback(
    (input: SetRepeatModeInput) => {
      return execute({ variables: { input } })
    },
    [execute]
  )
}

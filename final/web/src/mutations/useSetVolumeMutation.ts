import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import {
  SetVolumeInput,
  SetVolumeMutation,
  SetVolumeMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SET_VOLUME_MUTATION: TypedDocumentNode<
  SetVolumeMutation,
  SetVolumeMutationVariables
> = gql`
  mutation SetVolumeMutation($input: SetVolumeInput!) {
    setVolume(input: $input) {
      device {
        id
        volumePercent
      }
    }
  }
`

export const useSetVolumeMutation = () => {
  const [execute] = useMutation(SET_VOLUME_MUTATION)

  return useCallback(
    (input: SetVolumeInput) => {
      return execute({ variables: { input } })
    },
    [execute]
  )
}

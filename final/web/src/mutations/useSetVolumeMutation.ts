import { useCallback } from 'react'

import { TypedDocumentNode } from '@apollo/client'
import { SetVolumeMutation, SetVolumeMutationVariables } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SET_VOLUME_MUTATION: TypedDocumentNode<
  SetVolumeMutation,
  SetVolumeMutationVariables
> = gql`
  mutation SetVolumeMutation($volumePercent: Int!) {
    setVolume(volumePercent: $volumePercent) {
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
    (variables: SetVolumeMutationVariables) => {
      return execute({ variables })
    },
    [execute]
  )
}

import { TypedDocumentNode } from '@apollo/client'
import {
  SaveTrackInput,
  SaveTrackMutation,
  SaveTrackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const SAVE_TRACK_MUTATION: TypedDocumentNode<
  SaveTrackMutation,
  SaveTrackMutationVariables
> = gql`
  mutation SaveTrackMutation($input: SaveTrackInput!) {
    saveTrack(input: $input) {
      addedAt
      track {
        id
      }
    }
  }
`

export const useSaveTrackMutation = () => {
  const [execute] = useMutation(SAVE_TRACK_MUTATION)

  return (input: SaveTrackInput) => {
    return execute({ variables: { input } })
  }
}

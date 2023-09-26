import {
  RemoveSavedTrackInput,
  RemoveSavedTrackMutation,
  RemoveSavedTrackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import NotificationManager from 'src/components/NotificationManager'

const REMOVE_SAVED_TRACK_MUTATION = gql`
  mutation RemoveSavedTrackMutation($input: RemoveSavedTrackInput!) {
    removeSavedTrack(input: $input) {
      track {
        id
      }
    }
  }
`

export const useRemoveSavedTrackMutation = () => {
  const [execute] = useMutation<
    RemoveSavedTrackMutation,
    RemoveSavedTrackMutationVariables
  >(REMOVE_SAVED_TRACK_MUTATION)

  return (input: RemoveSavedTrackInput) => {
    return execute({
      variables: { input },
      onCompleted: () => {
        NotificationManager.notify('Removed from your Liked Songs')
      },
    })
  }
}

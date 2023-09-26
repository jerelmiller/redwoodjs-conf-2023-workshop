import {
  SaveTrackInput,
  SaveTrackMutation,
  SaveTrackMutationVariables,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import NotificationManager from 'src/components/NotificationManager'

const SAVE_TRACK_MUTATION = gql`
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
  const [execute] = useMutation<SaveTrackMutation, SaveTrackMutationVariables>(
    SAVE_TRACK_MUTATION
  )

  return (input: SaveTrackInput) => {
    return execute({
      variables: { input },
      onCompleted: () => {
        NotificationManager.notify('Added to your Liked Songs')
      },
    })
  }
}

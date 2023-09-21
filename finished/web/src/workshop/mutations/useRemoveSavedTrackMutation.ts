import {
  RemoveSavedTrackInput,
  RemoveSavedTrackMutation,
  RemoveSavedTrackMutationVariables,
  SavedTrackEdge,
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
      update: (cache, { data }) => {
        if (!data?.removeSavedTrack?.track) {
          return
        }

        cache.modify({
          id: cache.identify({ __typename: 'CurrentUser' }),
          fields: {
            tracks: (existing, { readField }) => {
              const edges = readField<SavedTrackEdge[]>('edges', existing) ?? []

              return {
                ...existing,
                edges: edges.filter(
                  (edge) => readField('id', edge.node) !== input.id
                ),
              }
            },
          },
        })
      },
    })
  }
}

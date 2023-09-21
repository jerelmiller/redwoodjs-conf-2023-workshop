import { TypedDocumentNode } from '@apollo/client'
import {
  SaveTrackInput,
  SaveTrackMutation,
  SaveTrackMutationVariables,
  SavedTrackEdge,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import NotificationManager from 'src/components/NotificationManager'

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
  const [execute] = useMutation<SaveTrackMutation, SaveTrackMutationVariables>(
    SAVE_TRACK_MUTATION
  )

  return (input: SaveTrackInput) => {
    return execute({
      variables: { input },
      onCompleted: () => {
        NotificationManager.notify('Added to your Liked Songs')
      },
      update: (cache, { data }) => {
        if (!data?.saveTrack?.track) {
          return
        }

        cache.modify({
          id: cache.identify({ __typename: 'CurrentUser' }),
          fields: {
            tracks: (existing, { toReference, readField }) => {
              const trackRef = toReference({
                __typename: 'Track',
                id: input.id,
              })

              const savedTrack = {
                __typename: 'SavedTrackEdge',
                addedAt: data.saveTrack?.addedAt,
                node: trackRef,
              }

              const edges = readField<SavedTrackEdge[]>('edges', existing) ?? []

              return {
                ...existing,
                edges: [savedTrack, ...edges],
              }
            },
          },
        })

        cache.writeFragment({
          id: cache.identify({ __typename: 'CurrentUser' }),
          fragment: gql`
            fragment SaveTracksMutationFragment on CurrentUser {
              tracksContains(ids: $ids)
            }
          `,
          data: {
            tracksContains: [true],
          },
          variables: {
            ids: [input.id],
          },
        })
      },
    })
  }
}

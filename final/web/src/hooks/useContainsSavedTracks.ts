import {
  ContainsSavedTracksQuery,
  ContainsSavedTracksQueryVariables,
} from 'types/graphql'

import { useQuery } from '@redwoodjs/web'

const CONTAINS_SAVED_TRACKS_QUERY = gql`
  query ContainsSavedTracksQuery($ids: [ID!]!) {
    me {
      tracksContains(ids: $ids)
    }
  }
`

export const useContainsSavedTracks = (ids: string[]) => {
  const { data, loading } = useQuery<
    ContainsSavedTracksQuery,
    ContainsSavedTracksQueryVariables
  >(CONTAINS_SAVED_TRACKS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { ids },
    skip: ids.length === 0,
  })

  return ids.reduce((map, id, idx) => {
    // If we already have loaded some data and we start loading again, try and
    // use the old data if possible
    const saved =
      loading && !data ? false : data?.me?.tracksContains?.[idx] ?? false

    return map.set(id, saved)
  }, new Map<string, boolean>())
}

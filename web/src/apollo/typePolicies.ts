import type { TypePolicies } from '@apollo/client'

export const typePolicies: TypePolicies = {
  CurrentUser: {
    keyFields: [],
  },
  Image: {
    keyFields: ['url'],
  },
  Player: {
    keyFields: [],
  },
  PlaybackState: {
    keyFields: [],
  },
}

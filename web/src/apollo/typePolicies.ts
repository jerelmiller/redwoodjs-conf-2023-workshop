import type { TypePolicies } from '@apollo/client'

export const typePolicies: TypePolicies = {
  Image: {
    keyFields: ['url'],
  },
  PlaybackState: {
    keyFields: [],
  },
}

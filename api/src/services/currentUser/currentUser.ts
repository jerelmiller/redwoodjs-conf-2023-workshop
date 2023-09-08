import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const me: QueryResolvers['me'] = () => {
  return {}
}

export const CurrentUser: CurrentUserResolvers = {
  profile: () => null,
}

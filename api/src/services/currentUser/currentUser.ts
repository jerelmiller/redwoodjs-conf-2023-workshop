import type { QueryResolvers, CurrentUserResolvers } from 'types/graphql'

export const me: QueryResolvers['me'] = () => {
  return context.currentUser ? {} : null
}

export const CurrentUser: CurrentUserResolvers = {
  profile: () => context.currentUser ?? null,
}

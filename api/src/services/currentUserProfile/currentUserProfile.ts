import { CurrentUserProfileRelationResolvers } from 'types/graphql'
import { db } from 'src/lib/db'

export const CurrentUserProfile: CurrentUserProfileRelationResolvers = {
  images: (_, { root }) => {
    return db.image.findMany({
      where: {
        users: {
          some: { id: root.id },
        },
      },
    })
  },
}

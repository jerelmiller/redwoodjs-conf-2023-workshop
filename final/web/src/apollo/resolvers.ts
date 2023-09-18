import { Resolvers } from '@apollo/client'
import { Image } from 'types/graphql'

import { toRGB } from 'src/utils/color'
import { getVibrantColor } from 'src/utils/image'

export const resolvers: Resolvers = {
  Image: {
    vibrantColor: async (image: Image, { alpha }: { alpha: number }) => {
      if (!image.url) {
        throw new Error(
          'Image must select `url` in order to determine vibrant color'
        )
      }

      const swatch = await getVibrantColor(image.url)

      return swatch ? toRGB(swatch, alpha) : null
    },
  },
}

import Vibrant from 'node-vibrant'
import type { ImageRelationResolvers } from 'types/graphql'

import { toRGB } from 'src/utils/color'

const PREFERRED_SWATCHES = [
  'Vibrant',
  'LightVibrant',
  'DarkVibrant',
  'Muted',
  'LightMuted',
  'DarkMuted',
]

export const Image: ImageRelationResolvers = {
  vibrantColor: async ({ alpha }, { root }) => {
    const palette = await Vibrant.from(root.url).getPalette()
    const name = PREFERRED_SWATCHES.find((name) => palette[name])
    const swatch = name ? palette[name] : undefined

    return swatch ? toRGB(swatch, alpha ?? undefined) : null
  },
}

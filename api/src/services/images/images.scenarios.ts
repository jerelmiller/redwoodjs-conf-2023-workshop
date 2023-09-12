import type { Prisma, Image } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ImageCreateArgs>({
  image: {
    one: { data: { url: 'String7309406' } },
    two: { data: { url: 'String5761161' } },
  },
})

export type StandardScenario = ScenarioData<Image, 'image'>

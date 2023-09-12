import type { Prisma, Track } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TrackCreateArgs>({
  track: {
    one: {
      data: {
        durationMs: 1346209,
        explicit: true,
        name: 'String',
        trackNumber: 8323214,
        album: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        durationMs: 1203894,
        explicit: true,
        name: 'String',
        trackNumber: 4792521,
        album: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Track, 'track'>

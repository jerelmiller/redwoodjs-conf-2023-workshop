import type { Track } from '@prisma/client'

import { tracks, track, createTrack, updateTrack, deleteTrack } from './tracks'
import type { StandardScenario } from './tracks.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tracks', () => {
  scenario('returns all tracks', async (scenario: StandardScenario) => {
    const result = await tracks()

    expect(result.length).toEqual(Object.keys(scenario.track).length)
  })

  scenario('returns a single track', async (scenario: StandardScenario) => {
    const result = await track({ id: scenario.track.one.id })

    expect(result).toEqual(scenario.track.one)
  })

  scenario('creates a track', async (scenario: StandardScenario) => {
    const result = await createTrack({
      input: {
        albumId: scenario.track.two.albumId,
        durationMs: 6947685,
        explicit: true,
        name: 'String',
        trackNumber: 8553405,
      },
    })

    expect(result.albumId).toEqual(scenario.track.two.albumId)
    expect(result.durationMs).toEqual(6947685)
    expect(result.explicit).toEqual(true)
    expect(result.name).toEqual('String')
    expect(result.trackNumber).toEqual(8553405)
  })

  scenario('updates a track', async (scenario: StandardScenario) => {
    const original = (await track({ id: scenario.track.one.id })) as Track
    const result = await updateTrack({
      id: original.id,
      input: { durationMs: 5269841 },
    })

    expect(result.durationMs).toEqual(5269841)
  })

  scenario('deletes a track', async (scenario: StandardScenario) => {
    const original = (await deleteTrack({ id: scenario.track.one.id })) as Track
    const result = await track({ id: original.id })

    expect(result).toEqual(null)
  })
})

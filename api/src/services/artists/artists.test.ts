import type { Artist } from '@prisma/client'

import {
  artists,
  artist,
  createArtist,
  updateArtist,
  deleteArtist,
} from './artists'
import type { StandardScenario } from './artists.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('artists', () => {
  scenario('returns all artists', async (scenario: StandardScenario) => {
    const result = await artists()

    expect(result.length).toEqual(Object.keys(scenario.artist).length)
  })

  scenario('returns a single artist', async (scenario: StandardScenario) => {
    const result = await artist({ id: scenario.artist.one.id })

    expect(result).toEqual(scenario.artist.one)
  })

  scenario('creates a artist', async () => {
    const result = await createArtist({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a artist', async (scenario: StandardScenario) => {
    const original = (await artist({ id: scenario.artist.one.id })) as Artist
    const result = await updateArtist({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a artist', async (scenario: StandardScenario) => {
    const original = (await deleteArtist({
      id: scenario.artist.one.id,
    })) as Artist
    const result = await artist({ id: original.id })

    expect(result).toEqual(null)
  })
})

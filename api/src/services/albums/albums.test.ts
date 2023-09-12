import type { Album } from '@prisma/client'

import { albums, album, createAlbum, updateAlbum, deleteAlbum } from './albums'
import type { StandardScenario } from './albums.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('albums', () => {
  scenario('returns all albums', async (scenario: StandardScenario) => {
    const result = await albums()

    expect(result.length).toEqual(Object.keys(scenario.album).length)
  })

  scenario('returns a single album', async (scenario: StandardScenario) => {
    const result = await album({ id: scenario.album.one.id })

    expect(result).toEqual(scenario.album.one)
  })

  scenario('creates a album', async () => {
    const result = await createAlbum({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a album', async (scenario: StandardScenario) => {
    const original = (await album({ id: scenario.album.one.id })) as Album
    const result = await updateAlbum({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a album', async (scenario: StandardScenario) => {
    const original = (await deleteAlbum({ id: scenario.album.one.id })) as Album
    const result = await album({ id: original.id })

    expect(result).toEqual(null)
  })
})

import type { Playlist } from '@prisma/client'

import {
  playlists,
  playlist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from './playlists'
import type { StandardScenario } from './playlists.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('playlists', () => {
  scenario('returns all playlists', async (scenario: StandardScenario) => {
    const result = await playlists()

    expect(result.length).toEqual(Object.keys(scenario.playlist).length)
  })

  scenario('returns a single playlist', async (scenario: StandardScenario) => {
    const result = await playlist({ id: scenario.playlist.one.id })

    expect(result).toEqual(scenario.playlist.one)
  })

  scenario('creates a playlist', async () => {
    const result = await createPlaylist({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a playlist', async (scenario: StandardScenario) => {
    const original = (await playlist({
      id: scenario.playlist.one.id,
    })) as Playlist
    const result = await updatePlaylist({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a playlist', async (scenario: StandardScenario) => {
    const original = (await deletePlaylist({
      id: scenario.playlist.one.id,
    })) as Playlist
    const result = await playlist({ id: original.id })

    expect(result).toEqual(null)
  })
})

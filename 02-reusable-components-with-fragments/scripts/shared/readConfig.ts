import fs from 'node:fs'
import path from 'node:path'

import toml from 'toml'

type WorkshopConfig = {
  user: {
    displayName: string
  }
  device: {
    name?: string
    type?: string
  }
  spotify: {
    saved: {
      albumIds: string[]
      trackIds: string[]
    }
    synced: {
      albumIds: string[]
      artistIds: string[]
      playlistIds: string[]
    }
  }
}

export const readConfig = (): WorkshopConfig => {
  return toml.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../workshop.config.toml'),
      'utf8'
    )
  )
}

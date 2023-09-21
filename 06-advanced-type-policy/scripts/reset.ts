import { db } from 'api/src/lib/db'

import { readConfig } from './shared/readConfig'

export default async () => {
  const config = readConfig()

  console.log('Resetting playback state...')
  await db.playbackState.deleteMany({
    where: { user: { displayName: config.user.displayName } },
  })
}

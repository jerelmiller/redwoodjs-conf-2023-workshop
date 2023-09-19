import { db } from 'api/src/lib/db'

import { readConfig } from './shared/readConfig'

export default async () => {
  const config = readConfig()

  await db.playbackState.deleteMany({
    where: { user: { displayName: config.user.displayName } },
  })
}

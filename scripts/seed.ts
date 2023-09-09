import fs from 'node:fs'
import path from 'node:path'

import { db } from 'api/src/lib/db'

import type { Artist, SpotifyRecordWithRefs } from './shared/types'

const saveRecord = async (record: SpotifyRecordWithRefs) => {
  switch (record.type) {
    case 'artist':
      return saveArtist(record)
  }
}

const saveArtist = async (artist: Artist) => {
  const images = artist.images.map((image) => {
    return {
      where: {
        artistId_imageUrl: { artistId: artist.id, imageUrl: image.url },
      },
      create: {
        image: {
          connectOrCreate: {
            where: { url: image.url },
            create: image,
          },
        },
      },
    }
  })

  return db.artist.upsert({
    where: {
      id: artist.id,
    },
    create: {
      id: artist.id,
      name: artist.name,
      followerCount: artist.followers.total,
      images: {
        connectOrCreate: images,
      },
    },
    update: {
      name: artist.name,
      followerCount: artist.followers.total,
      images: {
        connectOrCreate: images,
      },
    },
  })
}

export default async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, './spotify.json'), 'utf8')
    )

    for (const record of Object.values(data)) {
      await saveRecord(record as SpotifyRecordWithRefs)
    }
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}

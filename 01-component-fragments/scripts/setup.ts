import fs from 'node:fs'
import path from 'node:path'

const resolveSharedDir = (pathname: string) =>
  getRelative(path.join('../../shared/', pathname))

const getRelative = (relativePath: string) =>
  path.resolve(path.join(__dirname, relativePath))

const linkToShared = (pathname: string) => {
  const absolutePath = getRelative(pathname)
  const sharedPath = resolveSharedDir(
    path.relative(process.cwd(), absolutePath)
  )

  if (!fs.existsSync(sharedPath)) {
    fs.cpSync(absolutePath, sharedPath)
  }

  const tmpPath = `${absolutePath}.tmp`
  fs.symlinkSync(sharedPath, tmpPath)
  fs.renameSync(tmpPath, absolutePath)
}

export default async () => {
  linkToShared('../api/db/dev.db')
}

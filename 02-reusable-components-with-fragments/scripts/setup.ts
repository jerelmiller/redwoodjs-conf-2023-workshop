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

  symlink(sharedPath, absolutePath)
}

// Create a tmp symlink, then rename it to force symlinking and avoid errors
// when the file or symlink already exists
const symlink = (target: string, pathname: string) => {
  const tmpPath = `${pathname}.tmp`

  fs.symlinkSync(target, tmpPath)
  fs.renameSync(tmpPath, pathname)
}

export default async () => {
  // linkToShared('../api/db/dev.db')
  // linkToShared('../workshop.config.toml')
  symlink(getRelative('../README.md'), getRelative('../web/src/README.md'))
}

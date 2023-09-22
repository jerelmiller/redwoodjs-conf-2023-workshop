import fs from 'node:fs'
import path from 'node:path'

const resolveSetupDir = (pathname: string) =>
  getRelative(path.join('../../00-setup', pathname))

const getRelative = (relativePath: string) =>
  path.resolve(path.join(__dirname, relativePath))

const linkToShared = (pathname: string) => {
  const absolutePath = getRelative(pathname)
  const setupPath = resolveSetupDir(path.relative(process.cwd(), absolutePath))

  symlink(setupPath, absolutePath)
}

// Create a tmp symlink, then rename it to force symlinking and avoid errors
// when the file or symlink already exists
const symlink = (target: string, pathname: string) => {
  const tmpPath = `${pathname}.tmp`

  fs.symlinkSync(target, tmpPath)
  fs.renameSync(tmpPath, pathname)
}

export default async () => {
  linkToShared('../api/db/dev.db')
  linkToShared('../workshop.config.toml')
  linkToShared('../.env')
  symlink(getRelative('../README.md'), getRelative('../web/src/README.md'))
}

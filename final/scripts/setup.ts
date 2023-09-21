import fs from 'node:fs'
import path from 'node:path'

const getRelative = (relativePath: string) =>
  path.resolve(path.join(__dirname, relativePath))

// Create a tmp symlink, then rename it to force symlinking and avoid errors
// when the file or symlink already exists
const symlink = (target: string, pathname: string) => {
  const tmpPath = `${pathname}.tmp`

  fs.symlinkSync(target, tmpPath)
  fs.renameSync(tmpPath, pathname)
}

export default async () => {
  symlink(getRelative('../README.md'), getRelative('../web/src/README.md'))
}

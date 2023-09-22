import fs from 'node:fs'
import path from 'node:path'

const resolveSetupDir = (pathname: string) => {
  const absolutePath = getAbsolute(pathname)

  return getAbsolute(
    path.join('../../00-setup', path.relative(process.cwd(), absolutePath))
  )
}

const getAbsolute = (relativePath: string) =>
  path.resolve(path.join(__dirname, relativePath))

const linkIfExists = (pathname: string) => {
  const setupPath = resolveSetupDir(pathname)

  if (fs.existsSync(setupPath)) {
    linkToShared(pathname)
  }
}

const linkToShared = (pathname: string) => {
  symlink(resolveSetupDir(pathname), getAbsolute(pathname))
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
  linkIfExists('../web/public/avatar.png')
  symlink(getAbsolute('../README.md'), getAbsolute('../web/src/README.md'))
}

import path from 'path'

import { green } from 'picocolors'

import { isFolderEmpty, isWriteable, makeDir } from './utils'
import { tryGitInit } from './utils/git'

export class DownloadError extends Error {}

export async function createApp({
  appPath,
}: {
  appPath: string
}): Promise<void> {
  const root = path.resolve(appPath)

  if (!(await isWriteable(path.dirname(root)))) {
    console.error('The application path is not writable, please check folder permissions and try again.')
    console.error('It is likely you do not have write permissions for this folder.')

    process.exit(1)
  }

  const appName = path.basename(root)

  await makeDir(root)

  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const originalDirectory = process.cwd()

  console.log(`Creating a new App in ${green(root)}.`)
  console.log()

  process.chdir(root)

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.')
    console.log()
  }

  let cdpath: string

  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  console.log(`${green('Success!')} Created ${appName} at ${appPath}`)

  console.log()
}

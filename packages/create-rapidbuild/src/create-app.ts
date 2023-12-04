import fs from 'fs'
import path from 'path'

import { green } from 'picocolors'

import { writeFormatterAndLinterConfig } from './lib/write-formatter-linter-config'
import { writeGitIgnore } from './lib/write-git-ignore'
import { writePackageJson } from './lib/write-package-json'
import { FormatterTools, LinterTools } from './types'
import { PackageManager, isFolderEmpty, isWriteable, makeDir } from './utils'
import { tryGitInit } from './utils/git'
import { getOnline } from './utils/online'

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  linter,
  formatter,
  packageManager,
}: {
  appPath: string
  linter: LinterTools
  formatter: FormatterTools
  packageManager: PackageManager
}): Promise<void> {
  const root = path.resolve(appPath)

  const useYarn = packageManager === 'yarn'
  const isOnline = !useYarn || (await getOnline())

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

  await writePackageJson({ appName, linter, formatter, root, isOnline, packageManager })

  await writeFormatterAndLinterConfig({
    formatter,
    linter,
    root,
  })

  const ignorePath = path.join(root, '.gitignore')

  if (!fs.existsSync(ignorePath)) {
    await writeGitIgnore({ root })
  }

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
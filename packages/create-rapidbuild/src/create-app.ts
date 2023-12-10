import fs from 'fs'
import path from 'path'

import { green } from 'picocolors'

import { writeFormatterAndLinterConfig } from './lib/write-formatter-linter-config'
import { writeGitIgnore } from './lib/write-git-ignore'
import { writeHuskyConfig } from './lib/write-husky-config'
import { writePackageJson } from './lib/write-package-json'
import { writeTypescriptConfig } from './lib/write-typescript-config'
import { writeVSCodeConfig } from './lib/write-vscode-config'
import { ConfigApp } from './types'
import { installPackages, isFolderEmpty, isWriteable, makeDir } from './utils'
import { gitInitCommit, tryGitInit } from './utils/git'
import { getOnline } from './utils/online'

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  linter,
  formatter,
  packageManager,
  husky,
  language,
  vscode,
}: ConfigApp): Promise<void> {
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

  console.log(`Creating a new App in ${green(root)}.`)
  console.log()

  process.chdir(root)

  await writePackageJson({
    appName,
    linter,
    formatter,
    root,
    language,
    husky,
  })

  if (language === 'typescript') {
    await writeTypescriptConfig({ root })
  }

  await writeFormatterAndLinterConfig({
    formatter,
    linter,
    language,
    root,
  })

  await writeVSCodeConfig({ root, formatter, linter, vscode })

  await writeHuskyConfig({
    root,
    language,
    formatter,
    linter,
    husky,
  })

  const ignorePath = path.join(root, '.gitignore')

  if (!fs.existsSync(ignorePath)) {
    await writeGitIgnore({ root })
  }

  const didGitInit = tryGitInit(root)

  await installPackages(packageManager, isOnline)

  if (didGitInit) {
    gitInitCommit()

    console.log()

    console.log('Initialized a git repository.')

    console.log()
  }

  console.log(`${green('Success!')} Created ${appName} at ${appPath}`)

  console.log()
}

import { async as glob } from 'fast-glob'

import { ignoreFiles } from './constants'
import { getPackageManager } from './helpers/get-package-manager'
import { Project } from './types'

export async function scanFolder(root: string): Promise<string[]> {
  const ignore = ignoreFiles

  const files = await glob('**/*', {
    cwd: root,
    dot: true,
    ignore,
    markDirectories: true,
  })

  return files
}

export async function generateReport(): Promise<Project> {
  const files = await scanFolder('./')

  const config: Project = {}

  config.package_manager = getPackageManager(files)

  return config
}

console.log(await generateReport())

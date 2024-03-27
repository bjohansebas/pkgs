import { async as glob } from 'fast-glob'

import { ignoreFiles } from './constants'
import { getLanguages } from './helpers/get-languages'
import { getPackageManager } from './helpers/get-package-manager'
import type { Project } from './types'

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

export function generateReport({ files }: { files: string[] }): Project {
  const config: Project = {
    languages: getLanguages(files),
  }

  config.package_manager = getPackageManager(files)

  return config
}

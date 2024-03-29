import { getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { getLinters } from './helpers/get-linter'
import type { Project } from './types'

export function generateReport({ files }: { files: string[] }): Project {
  const config: Project = {
    languages: getLanguages(files),
    package_manager: getPackageManager(files),
    linters: getLinters(files),
  }

  return config
}

export * from './helpers'

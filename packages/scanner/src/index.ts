import { getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Project } from './types'

export function generateReport({ files }: { files: string[] }): Project {
  const config: Project = {
    languages: getLanguages(files),
    package_manager: getPackageManager(files),
    linters: getLinters(files),
    formatter: getFormatters(files),
  }

  return config
}

export * from './helpers'

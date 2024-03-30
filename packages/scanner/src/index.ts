import { getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Project } from './types'
import { getFileOfPath } from './utils/splitPath'

export function generateReport(files: string[]): Project {
  const fileOfPath = getFileOfPath(files)

  const config: Project = {
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters: getLinters(fileOfPath),
    formatter: getFormatters(fileOfPath),
  }

  return config
}

export * from './helpers'

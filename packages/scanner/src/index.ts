import { findPackageJson, getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { generatePackages } from './helpers/generate-packages'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Project } from './types'
import { getFileOfPath } from './utils/splitPath'

export async function generateReport(files: string[]): Promise<Project> {
  const packages = await findPackageJson(files)
  const packagesWthFiles = generatePackages(packages, files)

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

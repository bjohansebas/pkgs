import { findPackageJson, getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { generatePackages } from './helpers/generate-packages'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Package, Project } from './types'
import { getFileOfPath } from './utils/splitPath'

export interface ConfigReport {
  root: string
  checkContent?: boolean
  checkDepedencies?: boolean
}

export async function generateReport(files: string[], config?: ConfigReport): Promise<Project> {
  let parseConfig: ConfigReport

  if (!config) {
    parseConfig = { root: process.cwd() }
  } else {
    parseConfig = config
  }

  const packages = await findPackageJson(files)
  const packagesWithFiles = generatePackages(packages, files)

  const mainPackage = packagesWithFiles.filter((packageData) => packageData.path === '.')
  const subpackages = packagesWithFiles.filter((packageData) => packageData.path !== '.')

  let packagesProject: Package[] | null = null

  if (subpackages.length > 0) {
    const resolvePackages = await Promise.all(
      subpackages.map(async (value) => {
        const pathOfFiles = getFileOfPath(value.files)
        const formatter = await getFormatters(value.files, parseConfig)
        // TODO: show name of package
        return {
          languages: getLanguages(pathOfFiles),
          linters: getLinters(pathOfFiles),
          formatter,
        }
      }),
    )

    packagesProject = resolvePackages
  }

  const fileOfPath = getFileOfPath(mainPackage[0].files)

  const formatter = await getFormatters(mainPackage[0].files, parseConfig)

  const configProject: Project = {
    // TODO: return languages of all packages
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters: getLinters(fileOfPath),
    formatter,
    packages: packagesProject,
  }

  return configProject
}

export * from './helpers'

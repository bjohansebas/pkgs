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

// TODO: speed with promise
export async function generateReport(files: string[], config?: ConfigReport): Promise<Project> {
  let parseConfig: ConfigReport

  if (!config) {
    parseConfig = { root: process.cwd(), checkDepedencies: true }
  } else {
    parseConfig = config

    if (config.checkDepedencies === undefined) {
      parseConfig.checkDepedencies = true
    }
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
        const [formatter, linters] = await Promise.all([
          getFormatters(value.files, parseConfig),
          getLinters(value.files, parseConfig),
        ])

        // TODO: show name of package
        return {
          languages: getLanguages(pathOfFiles),
          linters,
          formatter,
        }
      }),
    )

    packagesProject = resolvePackages
  }

  const fileOfPath = getFileOfPath(mainPackage[0].files)

  const [formatter, linters] = await Promise.all([
    getFormatters(mainPackage[0].files, parseConfig),
    getLinters(mainPackage[0].files, parseConfig),
  ])

  const configProject: Project = {
    // TODO: return languages of all packages
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters,
    formatter,
    packages: packagesProject,
  }

  return configProject
}

export * from './helpers'

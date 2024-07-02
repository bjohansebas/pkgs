import { findPackageJson, getLanguages } from './helpers'
import { getPackageManager } from './helpers'
import { generatePackages } from './helpers/generate-packages'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Package, Project } from './types'
import { getFileOfPath } from './utils/splitPath'

export async function generateReport(files: string[]): Promise<Project> {
  const packages = await findPackageJson(files)
  const packagesWithFiles = generatePackages(packages, files)

  const mainPackage = packagesWithFiles.filter((packageData) => packageData.path === '.')
  const subpackages = packagesWithFiles.filter((packageData) => packageData.path !== '.')

  let packagesProject: Package[] | null = null

  if (subpackages.length > 0) {
    packagesProject = subpackages.map((value) => {
      const pathOfFiles = getFileOfPath(value.files)

      return {
        languages: getLanguages(pathOfFiles),
        linters: getLinters(pathOfFiles),
        formatter: getFormatters(pathOfFiles),
      }
    })
  }

  const fileOfPath = getFileOfPath(mainPackage[0].files)

  const config: Project = {
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters: getLinters(fileOfPath),
    formatter: getFormatters(fileOfPath),
    packages: packagesProject,
  }

  return config
}

export * from './helpers'

import { TEST_MODE } from './constants'
import { findPackageJson } from './helpers'
import { generatePackages } from './helpers/generate-packages'
import { transpileMainPackage, transpilePackages } from './helpers/transpile-packages'

import type { ConfigReport, Project } from './types'

export async function generateReport(files: string[], config?: ConfigReport): Promise<Project> {
  let parseConfig: ConfigReport

  if (!config) {
    parseConfig = { root: process.cwd(), checkDepedencies: !TEST_MODE }
  } else {
    parseConfig = config

    if (config.checkDepedencies === undefined) {
      parseConfig.checkDepedencies = !TEST_MODE
    }
  }

  const packages = await findPackageJson(files)
  const packagesWithFiles = generatePackages(packages, files, parseConfig.root)

  const mainPackage = packagesWithFiles.filter((packageData) => packageData.path === '.')[0]
  const subpackages = packagesWithFiles.filter((packageData) => packageData.path !== '.')

  const [project, packagesProject] = await Promise.all([
    transpileMainPackage(mainPackage.files, parseConfig),
    transpilePackages(subpackages, parseConfig),
  ])

  const configProject: Project = {
    ...project,
    packages: packagesProject,
  }

  return configProject
}

export * from './helpers'

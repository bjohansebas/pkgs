import { TEST_MODE } from './constants/env'
import { generatePackages } from './helpers/generate-packages'
import { transpileMainPackage, transpilePackages } from './helpers/transpile-packages'

import type { ConfigReport, Project } from './types'

export async function generateReport(files: string[], config?: ConfigReport): Promise<Project> {
  let parseConfig: ConfigReport

  if (!config) {
    parseConfig = { root: process.cwd(), checkDependencies: !TEST_MODE }
  } else {
    parseConfig = config

    if (config.checkDependencies === undefined) {
      parseConfig.checkDependencies = !TEST_MODE
    }
  }

  const packages = generatePackages(files, parseConfig.root)

  const mainPackage = packages.find((packageData) => packageData.path === '.') || { files: [] }
  const subpackages = packages.filter((packageData) => packageData.path !== '.')

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

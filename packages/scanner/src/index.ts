import { findPackageJson } from './helpers'
import { generatePackages } from './helpers/generate-packages'
import { transpileMainPackage, transpilePackages } from './helpers/transpile-packages'

import type { Project } from './types'

export interface ConfigReport {
  root: string
  checkContent?: boolean
  checkDepedencies?: boolean
}

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
  const packagesWithFiles = generatePackages(packages, files, parseConfig.root)

  const mainPackage = packagesWithFiles.filter((packageData) => packageData.path === '.')
  const subpackages = packagesWithFiles.filter((packageData) => packageData.path !== '.')

  const [project, packagesProject] = await Promise.all([
    transpileMainPackage(mainPackage[0].files, parseConfig),
    transpilePackages(subpackages, parseConfig),
  ])

  const configProject: Project = {
    ...project,
    packages: packagesProject,
  }

  return configProject
}

export * from './helpers'

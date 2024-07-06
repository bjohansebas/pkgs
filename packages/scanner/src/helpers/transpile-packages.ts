import type { ConfigReport, Project } from '@/types'
import { getFileOfPath } from '@/utils/splitPath'

import { getLanguages, getPackageManager } from '..'
import { getFormatters } from './get-formatter'
import { getLinters } from './get-linter'
import { resolveFiles } from './resolve-files'

export const transpileMainPackage = async (files: string[], config: ConfigReport) => {
  const { biome, prettier, eslint, packageJson } = await resolveFiles(files, config)

  const fileOfPath = getFileOfPath(files)

  const configProject: Project = {
    // TODO: return languages of all packages
    name: packageJson?.name || packageJson?.path || undefined,
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters: getLinters({ eslint, biome, config }),
    formatter: getFormatters({ biome, prettier, config }),
  }

  return configProject
}

export const transpilePackages = async (packages: { files: string[] }[], config: ConfigReport) => {
  return await Promise.all(
    packages.map(async (value) => {
      const pathOfFiles = getFileOfPath(value.files)

      const { biome, prettier, eslint, packageJson } = await resolveFiles(value.files, config)

      return {
        name: packageJson?.name || packageJson?.path || undefined,
        languages: getLanguages(pathOfFiles),
        linters: getLinters({ eslint, biome, config }),
        formatter: getFormatters({ biome, prettier, config }),
      }
    }),
  )
}

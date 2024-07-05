import type { ConfigReport, Project } from '@/types'
import { getFileOfPath } from '@/utils/splitPath'

import { getLanguages, getPackageManager } from '..'
import { getFormatters } from './get-formatter'
import { getLinters } from './get-linter'
import { resolveFiles } from './resolve-files'

export const transpileMainPackage = async (files: string[], config: ConfigReport) => {
  const { biome, prettier } = await resolveFiles(files, config)

  const linters = await getLinters(files, config)
  const fileOfPath = getFileOfPath(files)

  const configProject: Project = {
    // TODO: return languages of all packages
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters,
    formatter: getFormatters({ biome, prettier }),
  }

  return configProject
}

export const transpilePackages = async (packages: { files: string[] }[], config: ConfigReport) => {
  return await Promise.all(
    packages.map(async (value) => {
      const pathOfFiles = getFileOfPath(value.files)

      const { biome, prettier } = await resolveFiles(value.files, config)

      const linters = await getLinters(value.files, config)

      // TODO: show name of package
      return {
        languages: getLanguages(pathOfFiles),
        linters,
        formatter: getFormatters({ biome, prettier }),
      }
    }),
  )
}

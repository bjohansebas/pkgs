import type { Project } from '@/types'
import { getFileOfPath } from '@/utils/splitPath'

import { getLanguages, getPackageManager } from '..'
import type { ConfigReport } from '..'

import { getFormatters } from './get-formatter'
import { getLinters } from './get-linter'

export const transpileMainPackage = async (files: string[], config: ConfigReport) => {
  const [formatter, linters] = await Promise.all([getFormatters(files, config), getLinters(files, config)])
  const fileOfPath = getFileOfPath(files)

  const configProject: Project = {
    // TODO: return languages of all packages
    languages: getLanguages(fileOfPath),
    package_manager: getPackageManager(fileOfPath),
    linters,
    formatter,
  }

  return configProject
}

export const transpilePackages = async (packages: { files: string[] }[], config: ConfigReport) => {
  return await Promise.all(
    packages.map(async (value) => {
      const pathOfFiles = getFileOfPath(value.files)
      const [formatter, linters] = await Promise.all([
        getFormatters(value.files, config),
        getLinters(value.files, config),
      ])

      // TODO: show name of package
      return {
        languages: getLanguages(pathOfFiles),
        linters,
        formatter,
      }
    }),
  )
}

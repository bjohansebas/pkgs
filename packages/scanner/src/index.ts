import path from 'node:path'

import { getLanguages, readPackageJson } from './helpers'
import { getPackageManager } from './helpers'
import { getFormatters } from './helpers/get-formatter'
import { getLinters } from './helpers/get-linter'
import type { Project } from './types'
import { getFileOfPath, splitPath } from './utils/splitPath'

export function generateReport(files: string[]): Project {
  const packageJsons = files
    .filter((file) => {
      const splitFile = splitPath(file)

      if (splitFile[splitFile.length - 1] === 'package.json') return true
    })
    .map((file) => {
      const resolvedPath = path.resolve(file)

      return readPackageJson(resolvedPath)
    })

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

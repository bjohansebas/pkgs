import path from 'node:path'
import { async as glob } from 'fast-glob'

import { ignoreFiles } from '../constants'
import { splitPath } from '../utils/splitPath'

export async function scanFolder(root: string): Promise<string[]> {
  const ignore = ignoreFiles

  const files = await glob('**/*', {
    cwd: root,
    dot: true,
    ignore,
    markDirectories: true,
  })

  return files
}

export async function findPackageJson(files: string[]) {
  const packages = files
    .filter((file) => {
      const splitFile = splitPath(file)

      if (splitFile[splitFile.length - 1] === 'package.json') return true
    })
    .map((file) => {
      const pathPackage = splitPath(file)

      if (pathPackage.length === 1) pathPackage[0] = '.'

      if (pathPackage.length > 1) pathPackage.pop()

      const pathDir = pathPackage.join('/')

      return path.resolve(pathDir)
    })

  return packages
}

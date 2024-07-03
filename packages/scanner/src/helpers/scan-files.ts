import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { async as glob } from 'fast-glob'
import { parse } from 'parse-gitignore'

import { defaultIgnoreFiles } from '../constants'
import { splitPath } from '../utils/splitPath'

export async function scanFolder(root: string): Promise<string[]> {
  const gitignoreFiles = await readGitIgnore(root)

  const ignore = [
    ...defaultIgnoreFiles,
    ...gitignoreFiles.map((text) => {
      if (text.startsWith('**/')) {
        return text
      }

      return `**/${text}`
    }),
  ]

  const files = await glob('**/*', {
    cwd: root,
    dot: true,
    ignore,
    markDirectories: true,
  })

  return files
}

export async function readGitIgnore(root: string) {
  const pathFile = path.join(root, '.gitignore')

  if (!existsSync(pathFile)) {
    return []
  }

  const contentFile = await readFile(pathFile, 'utf8')

  return parse(contentFile).patterns
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

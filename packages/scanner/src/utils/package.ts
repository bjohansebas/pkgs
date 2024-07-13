import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { PackageJson } from '@/types'

// TODO: support .yaml https://github.com/pnpm/pnpm/pull/1799
// TODO: support .json5 https://github.com/pnpm/pnpm/pull/1799
export async function readPackageJson(files: string[], root: string): Promise<PackageJson | null> {
  const pathPackage = files.find((file) => {
    const splitPath = file.split('/')

    return splitPath[splitPath.length - 1] === 'package.json'
  })

  if (!pathPackage) return null

  const packageJson: PackageJson = {
    path: pathPackage,
  }

  try {
    const file = JSON.parse(await readFile(path.join(root, pathPackage), 'utf-8'))

    if (file.dependencies != null) packageJson.dependencies = file.dependencies
    if (file.devDependencies != null) packageJson.devDependencies = file.devDependencies
    if (file.eslintConfig != null) packageJson.eslintConfig = file.eslintConfig
    if (file.name != null) packageJson.name = file.name
    if (file.prettier != null) packageJson.prettier = file.prettier
    if (file.scripts != null) packageJson.scripts = file.scripts

    return packageJson
  } catch (e) {
    return null
  }
}

export function findDependencie(packageJson: PackageJson, dependencie: string) {
  let installed = false

  if (packageJson.dependencies == null && packageJson.devDependencies == null) {
    installed = false
  }

  if (packageJson.dependencies != null && packageJson.dependencies[dependencie] != null) {
    installed = true
  }

  if (!installed) {
    if (packageJson.devDependencies != null && packageJson.devDependencies[dependencie] != null) {
      installed = true
    }
  }

  return installed
}

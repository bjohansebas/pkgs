import type { PathLike } from 'node:fs'
import fs from 'node:fs/promises'
import type { PackageJson, PackageManager } from '../types'

export function getPackageManager(files: string[]): PackageManager[] | null {
  const results: PackageManager[] = []

  if (files.includes('pnpm-lock.yaml')) results.push('pnpm')
  if (files.includes('package-lock.json')) results.push('npm')
  if (files.includes('bun.lockb')) results.push('bun')
  if (files.includes('deno.lock')) results.push('deno')
  if (files.includes('yarn.lock')) results.push('yarn')

  if (results.length === 0) {
    return null
  }

  return results
}

export async function readPackageJson(path: PathLike): Promise<PackageJson | null> {
  try {
    const file = JSON.parse(await fs.readFile(path, 'utf-8'))
    const packageJson: PackageJson = {
      path,
    }

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

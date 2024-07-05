import type { PackageManager } from '../types'

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

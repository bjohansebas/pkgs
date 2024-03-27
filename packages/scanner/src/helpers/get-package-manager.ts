import type { PackageManager } from '../types'

export function getPackageManager(files: string[]): PackageManager | undefined {
  if (files.includes('pnpm-lock.yaml')) return 'pnpm'
  if (files.includes('package-lock.json')) return 'npm'
  if (files.includes('bun.lockb')) return 'bun'
  if (files.includes('yarn.lock')) return 'yarn'
}

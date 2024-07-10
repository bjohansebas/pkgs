import type { PackageJson } from '@/types'
import { findDependencie } from '@/utils/package'

export function checkDependencies(
  checkDependencies: boolean | undefined,
  packageJson: PackageJson | null | undefined,
  dependecie: string,
) {
  let installed = false

  if (checkDependencies && packageJson != null) {
    const installedDependencie = findDependencie(packageJson, dependecie)

    installed = installedDependencie
  } else if (checkDependencies === false) {
    installed = false
  } else if (checkDependencies === undefined && process.env.NODE_ENV === 'test') {
    installed = true
  } else if (checkDependencies === undefined) {
    installed = false
  }

  return installed
}

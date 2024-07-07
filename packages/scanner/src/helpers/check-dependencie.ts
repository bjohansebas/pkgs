import type { PackageJson } from '@/types'
import { findDependencie } from '@/utils/package'

export function checkDepedencies(
  checkDepedencies: boolean | undefined,
  packageJson: PackageJson | null | undefined,
  dependecie: string,
) {
  let installed = false

  if (checkDepedencies && packageJson != null) {
    const installedDependencie = findDependencie(packageJson, dependecie)

    installed = installedDependencie
  } else if (checkDepedencies === false) {
    installed = false
  } else if (checkDepedencies === undefined && process.env.NODE_ENV === 'test') {
    installed = true
  } else if (checkDepedencies === undefined) {
    installed = false
  }

  return installed
}

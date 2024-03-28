import type { Project } from '../types'
import { getLanguages } from './get-languages'
import { getPackageManager } from './get-package-manager'

export function generateReport({ files }: { files: string[] }): Project {
  const config: Project = {
    languages: getLanguages(files),
    package_manager: getPackageManager(files),
  }

  return config
}

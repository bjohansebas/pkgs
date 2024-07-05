import { eslintFiles } from '@/constants'
import type { ConfigReport, PackageJson } from '@/types'
import type { ESLintConfig } from '@/types/configs'
import { findDependencie } from './package'

// TODO: support plugins
export function resolveESLint(files: string[], config: ConfigReport, content?: { packageJson?: PackageJson | null }) {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return eslintFiles.find((eslintFile) => splitPath[splitPath.length - 1] === eslintFile)
  })

  const eslintConfig: ESLintConfig = {}

  if (pathConfig) {
    eslintConfig.config = true
    eslintConfig.path = pathConfig
  }

  if (!pathConfig) {
    if (content?.packageJson == null) return null

    if (content.packageJson.eslintConfig != null) {
      eslintConfig.path = content.packageJson.path
      eslintConfig.config = true
    }
  }

  if (config.checkDepedencies && content?.packageJson != null) {
    const installed = findDependencie(content.packageJson, 'eslint')

    eslintConfig.installed = installed
  }

  return eslintConfig
}

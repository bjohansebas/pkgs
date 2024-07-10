import path from 'node:path'

import { eslintFiles } from '@/constants'
import { checkDependencies } from '@/helpers/check-dependencie'
import type { ConfigReport, PackageJson } from '@/types'
import type { ESLintConfig } from '@/types/configs'

// TODO: support plugins
// TODO: Check priority to obtain the configuration
export function resolveESLint(files: string[], config: ConfigReport, content?: { packageJson?: PackageJson | null }) {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return eslintFiles.find((eslintFile) => splitPath[splitPath.length - 1] === eslintFile)
  })

  const eslintConfig: ESLintConfig = {}

  if (pathConfig) {
    eslintConfig.config = true
    eslintConfig.path = path.join(config.root, pathConfig)
  }

  if (!pathConfig) {
    if (
      content?.packageJson == null ||
      (config.checkDependencies === true &&
        content?.packageJson?.dependencies == null &&
        content?.packageJson?.devDependencies == null &&
        content?.packageJson?.prettier == null)
    )
      return null

    if (content.packageJson.eslintConfig != null) {
      eslintConfig.path = content.packageJson.path
      eslintConfig.config = true
    }
  }

  eslintConfig.installed = checkDependencies(config.checkDependencies, content?.packageJson, 'eslint')

  return eslintConfig
}

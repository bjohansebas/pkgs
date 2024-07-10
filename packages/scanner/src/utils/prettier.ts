import path from 'node:path'
import { prettierFiles } from '@/constants'
import { checkDependencies } from '@/helpers/check-dependencie'
import type { ConfigReport, PackageJson } from '@/types'
import type { PrettierConfig } from '@/types/configs'

// TODO: support plugins
// TODO: Check priority to obtain the configuration
export function resolvePrettier(files: string[], config: ConfigReport, content?: { packageJson?: PackageJson | null }) {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return prettierFiles.find((prettierFile) => splitPath[splitPath.length - 1] === prettierFile)
  })

  const prettierConfig: PrettierConfig = {}

  if (pathConfig) {
    prettierConfig.config = true
    prettierConfig.path = path.join(config.root, pathConfig)
  }

  if (!pathConfig) {
    if (
      content?.packageJson == null ||
      (config.checkDependencies === true &&
        content?.packageJson?.dependencies == null &&
        content?.packageJson?.devDependencies == null &&
        content?.packageJson?.prettier == null)
    ) {
      return null
    }

    if (content.packageJson.prettier != null) {
      prettierConfig.path = content.packageJson.path
      prettierConfig.config = true
    }
  }

  prettierConfig.installed = checkDependencies(config.checkDependencies, content?.packageJson, 'prettier')

  return prettierConfig
}

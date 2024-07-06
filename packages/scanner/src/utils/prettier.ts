import { prettierFiles } from '@/constants'
import type { ConfigReport, PackageJson } from '@/types'
import type { PrettierConfig } from '@/types/configs'
import { findDependencie } from './package'

// TODO: support plugins
export function resolvePrettier(files: string[], config: ConfigReport, content?: { packageJson?: PackageJson | null }) {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return prettierFiles.find((prettierFile) => splitPath[splitPath.length - 1] === prettierFile)
  })

  const prettierConfig: PrettierConfig = {
    installed: config.checkDepedencies,
  }

  if (pathConfig) {
    prettierConfig.config = true
    prettierConfig.path = pathConfig
  }

  if (!pathConfig) {
    if (content?.packageJson == null) return null

    if (content.packageJson.prettier != null) {
      prettierConfig.path = content.packageJson.path
      prettierConfig.config = true
    }
  }

  if (config.checkDepedencies && content?.packageJson != null) {
    const installed = findDependencie(content.packageJson, 'prettier')

    prettierConfig.installed = installed
  }

  return prettierConfig
}

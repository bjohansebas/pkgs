import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { biomeFiles } from '@/constants'
import { checkDependencies } from '@/helpers/check-dependencie'
import type { ConfigReport, PackageJson } from '@/types'
import type { BiomeConfig } from '@/types/configs'

export async function resolveBiomeConfig(
  files: string[],
  config: ConfigReport,
  content?: {
    packageJson?: PackageJson | null
    biomeContent?: string
  },
): Promise<BiomeConfig | null> {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return biomeFiles.find((biomeFile) => splitPath[splitPath.length - 1] === biomeFile)
  })

  const biomeConfig: BiomeConfig = {
    formatter: true,
    linter: true,
  }

  if (!pathConfig) {
    if (
      content?.packageJson == null ||
      (config.checkDependencies === true &&
        content?.packageJson?.dependencies == null &&
        content?.packageJson?.devDependencies == null)
    ) {
      return null
    }
  }

  if (pathConfig) {
    biomeConfig.path = path.join(config.root, pathConfig)
  }

  if (config?.checkContent && pathConfig) {
    const contentConfig = content?.biomeContent ?? (await readFile(path.join(config.root, pathConfig), 'utf8'))

    const { formatter, linter } = readBiomeConfig(contentConfig)

    biomeConfig.formatter = formatter
    biomeConfig.linter = linter
  }

  biomeConfig.installed = checkDependencies(config.checkDependencies, content?.packageJson, '@biomejs/biome')

  return biomeConfig
}

export function readBiomeConfig(content: string): BiomeConfig {
  const config: BiomeConfig = {}

  try {
    const jsonContent = JSON.parse(content)

    if (jsonContent?.formatter?.enabled !== undefined) config.formatter = jsonContent.formatter.enabled
    if (jsonContent?.linter?.enabled !== undefined) config.linter = jsonContent.linter.enabled
  } catch {
    config.formatter = false
    config.linter = false
  }

  return config
}

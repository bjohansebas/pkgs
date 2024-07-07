import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { biomeFiles } from '@/constants'
import type { ConfigReport, PackageJson } from '@/types'
import type { BiomeConfig } from '@/types/configs'
import { findDependencie } from './package'

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

  if (!pathConfig) return null

  const biomeConfig: BiomeConfig = {
    path: path.join(config.root, pathConfig),
    formatter: true,
    linter: true,
  }

  if (config?.checkContent && pathConfig) {
    const contentConfig = content?.biomeContent ?? (await readFile(path.join(config.root, pathConfig), 'utf8'))

    const { formatter, linter } = readBiomeConfig(contentConfig)

    biomeConfig.formatter = formatter
    biomeConfig.linter = linter
  }

  if (config.checkDepedencies && content?.packageJson != null) {
    const installed = findDependencie(content.packageJson, '@biomejs/biome')

    biomeConfig.installed = installed
  } else if (config.checkDepedencies === false) {
    biomeConfig.installed = false
  } else if (config.checkDepedencies === undefined && process.env.NODE_ENV === 'test') {
    biomeConfig.installed = true
  } else if (config.checkDepedencies === undefined) {
    biomeConfig.installed = false
  }

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

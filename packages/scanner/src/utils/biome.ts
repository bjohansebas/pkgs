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
    installed: !config.checkDepedencies,
  }

  if (config?.checkContent) {
    const contentConfig = content?.biomeContent ?? (await readFile(path.join(config.root, pathConfig), 'utf8'))

    const { formatter, linter } = readBiomeConfig(contentConfig)

    biomeConfig.formatter = formatter
    biomeConfig.linter = linter
  }

  if (config.checkDepedencies && content?.packageJson != null) {
    const installed = findDependencie(content.packageJson, '@biomejs/biome')

    biomeConfig.installed = installed
  }

  return biomeConfig
}

export function readBiomeConfig(content: string): BiomeConfig {
  const config: BiomeConfig = {}

  const jsonContent = JSON.parse(content)

  if (jsonContent?.formatter?.enabled) config.formatter = true
  if (jsonContent?.linter?.enabled) config.linter = true

  return config
}

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { biomeFiles } from '@/constants'
import type { ConfigReport } from '..'

interface BiomeConfig {
  path?: string
  formatter?: boolean
  linter?: boolean
  installed?: boolean
}

export async function resolveBiomeConfig(files: string[], config: ConfigReport): Promise<BiomeConfig | null> {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return biomeFiles.find((biomeFile) => splitPath[splitPath.length - 1].includes(biomeFile))
  })

  if (!pathConfig) return null

  const biomeConfig: BiomeConfig = {
    path: pathConfig,
    formatter: true,
    linter: true,
  }

  if (config?.checkContent) {
    const contentConfig = await readFile(path.join(config.root, pathConfig), 'utf8')

    const { formatter, linter } = readBiomeConfig(contentConfig)

    biomeConfig.formatter = formatter
    biomeConfig.linter = linter
  }

  // TODO: check if exists such as dependencie

  return biomeConfig
}

export function readBiomeConfig(content: string): BiomeConfig {
  const config: BiomeConfig = {}

  const jsonContent = JSON.parse(content)

  if (jsonContent?.formatter?.enabled) config.formatter = true
  if (jsonContent?.linter?.enabled) config.linter = true

  return config
}

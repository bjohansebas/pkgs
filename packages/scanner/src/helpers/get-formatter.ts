import { resolveBiomeConfig } from '@/utils/biome'
import { resolvePrettier } from '@/utils/prettier'

import type { ConfigReport } from '..'
import type { Formatters } from '../types'

export async function getFormatters(files: string[], configProject: ConfigReport): Promise<Formatters[] | null> {
  const result: Formatters[] = []

  try {
    const [biomeConfig, prettierConfig] = await Promise.all([
      resolveBiomeConfig(files, configProject),
      resolvePrettier(files, configProject),
    ])

    if (biomeConfig != null && biomeConfig.formatter === true) result.push('biome')

    if (prettierConfig) result.push('prettier')

    if (result.length === 0) return null

    return result
  } catch {
    return null
  }
}

import type { BiomeConfig, PrettierConfig } from '@/types/configs'
import type { ConfigReport, Formatters } from '../types'

export function getFormatters({
  biome,
  prettier,
  config,
}: { biome: BiomeConfig | null; prettier: PrettierConfig | null; config: ConfigReport }): Formatters[] | null {
  const result: Formatters[] = []

  // TODO: support not config but is installed
  // TODO: verify formatter is active
  if (
    (config.checkDepedencies && biome?.installed === true) ||
    (!config.checkDepedencies && biome?.formatter === true)
  ) {
    result.push('biome')
  }

  if ((config.checkDepedencies && prettier?.installed === true) || (!config.checkDepedencies && prettier?.config)) {
    result.push('prettier')
  }

  if (result.length === 0) return null

  return result
}

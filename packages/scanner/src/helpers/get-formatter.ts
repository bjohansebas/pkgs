import type { BiomeConfig, PrettierConfig } from '@/types/configs'
import type { ConfigReport, Formatters } from '../types'

export function getFormatters({
  biome,
  prettier,
  config,
}: { biome: BiomeConfig | null; prettier: PrettierConfig | null; config: ConfigReport }): Formatters[] | null {
  const result: Formatters[] = []

  if (biome !== null) {
    if (biome.path == null && config.checkDependencies && biome.installed) {
      result.push('biome')
    }

    if (
      biome.path != null &&
      ((!config.checkContent && !config.checkDependencies) ||
        (config.checkDependencies && biome.installed) ||
        (config.checkContent && biome.formatter)) &&
      !result.includes('biome')
    ) {
      result.push('biome')

      if (config.checkContent && biome.formatter === false && result.includes('biome')) {
        result.pop()
      }
    }
  }

  if ((config.checkDependencies && prettier?.installed === true) || (!config.checkDependencies && prettier?.config)) {
    result.push('prettier')
  }

  if (result.length === 0) return null

  return result
}

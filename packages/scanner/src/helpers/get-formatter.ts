import type { BiomeConfig, PrettierConfig } from '@/types/configs'
import type { Formatters } from '../types'

export function getFormatters({
  biome,
  prettier,
}: { biome: BiomeConfig | null; prettier: PrettierConfig | null }): Formatters[] | null {
  const result: Formatters[] = []

  if (biome != null && biome.formatter === true) result.push('biome')

  if (prettier != null && prettier.installed === true) result.push('prettier')

  if (result.length === 0) return null

  return result
}

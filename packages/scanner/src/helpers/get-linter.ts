import type { BiomeConfig, ESLintConfig } from '@/types/configs'
import type { ConfigReport, Linters } from '../types'

export function getLinters({
  biome,
  eslint,
  config,
}: { biome: BiomeConfig | null; eslint: ESLintConfig | null; config: ConfigReport }): Linters[] | null {
  const result: Linters[] = []

  if (biome?.installed && biome.linter === true) result.push('biome')

  // TODO: verify if oxc is installed in package.json
  if ((config.checkDepedencies && eslint?.installed) || (!config.checkDepedencies && eslint?.config))
    result.push('eslint')

  if (result.length === 0) return null

  return result
}

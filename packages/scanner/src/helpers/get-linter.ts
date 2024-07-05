import type { BiomeConfig, ESLintConfig } from '@/types/configs'
import type { Linters } from '../types'

export function getLinters({
  biome,
  eslint,
}: { biome: BiomeConfig | null; eslint: ESLintConfig | null }): Linters[] | null {
  const result: Linters[] = []

  if (biome != null && biome.linter === true) result.push('biome')

  // TODO: verify if oxc is installed in package.json
  if (eslint?.installed) result.push('eslint')

  if (result.length === 0) return null

  return result
}

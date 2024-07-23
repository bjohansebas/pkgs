import type { BiomeConfig, ESLintConfig } from '@/types/configs'
import type { ConfigReport, Linters } from '../types'

// TODO: support oxc
export function getLinters({
  biome,
  eslint,
  config,
}: { biome: BiomeConfig | null; eslint: ESLintConfig | null; config: ConfigReport }) {
  if (config.mode === 'verbose') {
    return { eslint, biome }
  }

  const result: Linters[] = []

  if (biome !== null) {
    if (biome.path == null && config.checkDependencies && biome.installed) {
      result.push('biome')
    }

    if (
      biome.path != null &&
      ((!config.checkContent && !config.checkDependencies) ||
        (config.checkDependencies && biome.installed) ||
        (config.checkContent && biome.linter)) &&
      !result.includes('biome')
    ) {
      result.push('biome')

      if (config.checkContent && biome.linter === false && result.includes('biome')) {
        result.pop()
      }
    }
  }

  if ((config.checkDependencies && eslint?.installed) || (!config.checkDependencies && eslint?.config)) {
    result.push('eslint')
  }

  if (result.length === 0) return null

  return result
}

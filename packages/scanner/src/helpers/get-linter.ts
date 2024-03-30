import { biomeFiles, eslintFiles } from '../constants'
import type { Linters } from '../types'

export function getLinters(files: string[]): Linters[] | null {
  const result: Linters[] = []

  // TODO: check if linter is active
  const hasBiomeConfig = biomeFiles.find((value) => files.includes(value))

  if (hasBiomeConfig) result.push('biome')

  // TODO: verify if oxc is installed in package.json
  // TODO: verify if exist eslintConfig in package.json

  const hasEslintConfig = eslintFiles.find((value) => files.includes(value))

  if (hasEslintConfig) {
    result.push('eslint')
  }

  if (result.length === 0) {
    return null
  }

  return result
}

import type { Linters } from '../types'

export const biomeFiles = ['biome.json', 'biome.jsonc']
export const eslintFiles = [
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json',
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
]

export function getLinters(files: string[]): Linters[] | null {
  const result: Linters[] = []

  const filesSplit = files.map((value) => {
    const splitValue = value.split('/')
    return splitValue[splitValue.length - 1]
  })

  const hasBiomeConfig = biomeFiles.find((value) => filesSplit.includes(value))

  if (hasBiomeConfig) result.push('biome')

  // TODO: verify if oxc is installed in package.json
  // TODO: verify if exist eslintConfig in package.json

  const hasEslintConfig = eslintFiles.find((value) => filesSplit.includes(value))

  if (hasEslintConfig) {
    result.push('eslint')
  }

  if (result.length === 0) {
    return null
  }

  return result
}

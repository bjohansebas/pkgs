import { biomeFiles, prettierFiles } from '../constants'
import type { Formatters } from '../types'

export function getFormatters(files: string[]): Formatters[] | null {
  const result: Formatters[] = []

  // TODO: check if formatter is active
  const hasBiomeConfig = biomeFiles.find((value) => files.includes(value))

  if (hasBiomeConfig) result.push('biome')

  // TODO: verify if exist prettier key in package.json
  const hasPrettierConfig = prettierFiles.find((value) => files.includes(value))

  if (hasPrettierConfig) {
    result.push('prettier')
  }

  if (result.length === 0) {
    return null
  }

  return result
}

import { biomeFiles, prettierFiles } from '../constants'
import type { Formatters } from '../types'

export function getFormatters(files: string[]): Formatters[] | null {
  const result: Formatters[] = []

  const filesSplit = files.map((value) => {
    const splitValue = value.split('/')
    return splitValue[splitValue.length - 1]
  })

  // TODO: check if formatter is active
  const hasBiomeConfig = biomeFiles.find((value) => filesSplit.includes(value))

  if (hasBiomeConfig) result.push('biome')

  // TODO: verify if exist prettier key in package.json
  const hasPrettierConfig = prettierFiles.find((value) => filesSplit.includes(value))

  if (hasPrettierConfig) {
    result.push('prettier')
  }

  if (result.length === 0) {
    return null
  }

  return result
}

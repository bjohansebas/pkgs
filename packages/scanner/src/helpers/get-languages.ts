import type { Languages } from '../types'

const javascriptRegex = /\.(jsx|cjs|mjs|js)$/
const typescriptRegex = /\.(tsx|cts|mts|ts)$/

export function getLanguages(files: string[]): Languages[] | null {
  const results: Languages[] = []

  if (files.find((file) => javascriptRegex.test(file))) results.push('javascript')

  if (files.find((file) => typescriptRegex.test(file)) || files.includes('tsconfig.json')) results.push('typescript')

  if (results.length === 0) {
    return null
  }

  return results
}

import type { Languages } from '../types'

const javascriptRegex = /\.(jsx|cjs|mjs|js)$/
const typescriptRegex = /\.(tsx|cts|mts|ts)$/

export function getLanguages(files: string[]): Record<Languages, boolean> | null {
  const results: Record<Languages, boolean> = { javascript: false, typescript: false }

  if (files.find((file) => javascriptRegex.test(file))) results.javascript = true

  if (files.find((file) => typescriptRegex.test(file)) || files.includes('tsconfig.json')) results.typescript = true

  if (!Object.values(results).find((value) => value === true)) {
    return null
  }

  return results
}

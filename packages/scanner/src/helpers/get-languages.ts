import { Languages } from '../types'

const javascriptRegex = /\.(js)$/
const typescriptRegex = /\.(ts)$/

export function getLanguages(files: string[]): Languages[] | undefined {
  const results: Languages[] = []

  if (files.find((file) => javascriptRegex.test(file))) results.push('javascript')

  if (files.find((file) => typescriptRegex.test(file))) results.push('typescript')

  return results
}

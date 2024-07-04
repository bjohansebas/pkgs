import { resolveBiomeConfig } from '@/utils/biome'
import { getFileOfPath } from '@/utils/splitPath'
import type { ConfigReport } from '..'
import { eslintFiles } from '../constants'
import type { Linters } from '../types'

export async function getLinters(files: string[], configProject: ConfigReport): Promise<Linters[] | null> {
  const result: Linters[] = []

  const [biomeConfig] = await Promise.all([resolveBiomeConfig(files, configProject)])

  if (biomeConfig != null && biomeConfig.linter === true) result.push('biome')

  // TODO: verify if oxc is installed in package.json
  // TODO: verify if exist eslintConfig in package.json
  const parsePaths = getFileOfPath(files)
  const hasEslintConfig = eslintFiles.find((value) => parsePaths.includes(value))

  if (hasEslintConfig) {
    result.push('eslint')
  }

  if (result.length === 0) {
    return null
  }

  return result
}

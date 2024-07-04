import { resolveBiomeConfig } from '@/utils/biome'
import type { ConfigReport } from '..'
import { prettierFiles } from '../constants'
import type { Formatters } from '../types'

// TODO: use promise for most speed
export async function getFormatters(files: string[], configProject: ConfigReport): Promise<Formatters[] | null> {
  const result: Formatters[] = []

  const biomeConfig = await resolveBiomeConfig(files, configProject)

  if (biomeConfig != null && biomeConfig.formatter === true) {
    result.push('biome')
  }

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

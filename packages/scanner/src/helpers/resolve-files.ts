import { resolveBiomeConfig } from '@/utils/biome'
import { readPackageJson } from '@/utils/package'
import { resolvePrettier } from '@/utils/prettier'

import type { ConfigReport } from '@/types'

export async function resolveFiles(files: string[], config: ConfigReport) {
  const contentPackageJson = await readPackageJson(files)

  const [biomeConfig, prettierConfig] = await Promise.all([
    resolveBiomeConfig(files, config, {
      packageJson: contentPackageJson,
    }),
    resolvePrettier(files, config, { packageJson: contentPackageJson }),
  ])

  return {
    packageJson: contentPackageJson,
    biome: biomeConfig,
    prettier: prettierConfig,
  }
}

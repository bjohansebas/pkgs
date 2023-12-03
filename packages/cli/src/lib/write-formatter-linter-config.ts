import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { BiomeConfig } from '../types/biome'

export async function writeFormatterAndLinterConfig({
  linter,
  formatter,
  root,
}: {
  linter: string
  formatter: string
  root: string
}) {
  if (linter === 'biome' && formatter === 'biome') {
    const biomeConfig: BiomeConfig = {
      $schema: './node_modules/@biomejs/biome/configuration_schema.json',
      formatter: {
        enabled: true,
        indentStyle: 'space',
        indentWidth: 2,
        lineWidth: 120,
      },
      linter: {
        enabled: true,
        rules: {
          recommended: true,
        },
      },
      organizeImports: {
        enabled: true,
      },
      vcs: {
        clientKind: 'git',
        enabled: true,
        useIgnoreFile: true,
      },
    }

    await fs.writeFile(path.join(root, 'biome.json'), JSON.stringify(biomeConfig, null, 2) + os.EOL)

    return
  }

  if (linter !== '') {
    if (linter === 'biome') {
      const biomeConfig: BiomeConfig = {
        $schema: './node_modules/@biomejs/biome/configuration_schema.json',
        formatter: {
          enabled: false,
        },
        linter: {
          enabled: true,
          rules: {
            recommended: true,
          },
        },
        organizeImports: {
          enabled: false,
        },
        vcs: {
          clientKind: 'git',
          enabled: true,
          useIgnoreFile: true,
        },
      }

      await fs.writeFile(path.join(root, 'biome.json'), JSON.stringify(biomeConfig, null, 2) + os.EOL)
    }
  }

  if (formatter !== '') {
    if (formatter === 'biome') {
      const biomeConfig: BiomeConfig = {
        $schema: './node_modules/@biomejs/biome/configuration_schema.json',
        formatter: {
          enabled: true,
          indentStyle: 'space',
          indentWidth: 2,
          lineWidth: 120,
        },
        linter: {
          enabled: false,
        },
        organizeImports: {
          enabled: true,
        },
        vcs: {
          clientKind: 'git',
          enabled: true,
          useIgnoreFile: true,
        },
      }

      await fs.writeFile(path.join(root, 'biome.json'), JSON.stringify(biomeConfig, null, 2) + os.EOL)
    }
  }
}

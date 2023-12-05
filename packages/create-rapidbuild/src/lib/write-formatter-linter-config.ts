import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { FormatterTools, Languages, LinterTools } from '../types'
import { BiomeConfig } from '../types/biome'
import { ESLintConfig } from '../types/eslint'

export async function writeFormatterAndLinterConfig({
  linter,
  formatter,
  language,
  root,
}: {
  linter: LinterTools
  formatter: FormatterTools
  root: string
  language: Languages
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

  if (linter != null) {
    if (linter === 'eslint') {
      const eslintConfig: ESLintConfig = {
        env: {
          browser: true,
          es2021: true,
        },
        extends: 'eslint:recommended',
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        rules: {},
      }

      if (language === 'typescript') {
        eslintConfig.extends = ['eslint:recommended', 'plugin:@typescript-eslint/recommended']
        eslintConfig.parser = '@typescript-eslint/parser'
        eslintConfig.plugins = ['@typescript-eslint']
      }

      await fs.writeFile(path.join(root, '.eslintrc.json'), JSON.stringify(eslintConfig, null, 2) + os.EOL)
    }
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

  if (formatter != null) {
    if (formatter === 'prettier') {
      fs.writeFile(path.join(root, '.prettierrc'), '{}\n')
    }

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

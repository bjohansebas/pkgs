import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { FormatterTools, LinterTools, VSCodeConfig, VSCodeSettings } from '../types'
import { makeDir } from '../utils'

export async function writeVSCodeConfig({
  vscode,
  linter,
  formatter,
  root,
}: {
  vscode: VSCodeConfig
  linter: LinterTools
  formatter: FormatterTools
  root: string
}) {
  const vscodeSettings: VSCodeSettings = {
    'editor.formatOnSave': true,
  }
  const vscodeExtensions: { recommendations: string[] } = {
    recommendations: [],
  }

  if (!vscode.extensions && !vscode.settings) {
    return
  }

  if (vscode.extensions || vscode.settings) {
    const vscodeDir = path.resolve(`${root}/.vscode`)

    await makeDir(vscodeDir)
  }

  if (vscode.extensions) {
    if (linter === 'eslint') {
      vscodeExtensions.recommendations.push('dbaeumer.vscode-eslint')
    }

    if (linter === 'biome' || formatter === 'biome') {
      vscodeExtensions.recommendations.push('biomejs.biome')
    }

    if (formatter === 'prettier') {
      vscodeExtensions.recommendations.push('esbenp.prettier-vscode')
    }

    await fs.writeFile(path.join(root, '.vscode/extensions.json'), JSON.stringify(vscodeExtensions, null, 2) + os.EOL)
  }

  if (vscode.settings) {
    if (formatter === 'prettier') {
      vscodeSettings['editor.defaultFormatter'] = 'esbenp.prettier-vscode'
    }

    if (formatter === 'biome' || linter === 'biome') {
      vscodeSettings['editor.defaultFormatter'] = 'biomejs.biome'
      vscodeSettings['editor.codeActionsOnSave'] = {
        'quickfix.biome': true,
        'source.organizeImports.biome': formatter === 'biome',
      }
    }

    await fs.writeFile(path.join(root, '.vscode/settings.json'), JSON.stringify(vscodeSettings, null, 2) + os.EOL)
  }
}

import { execSync } from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { FormatterTools, HuskyConfig, Languages, LinterTools } from '../types'
import { makeDir } from '../utils'

export async function writeHuskyConfig({
  root,
  language,
  formatter,
  linter,
  husky,
}: {
  formatter: FormatterTools
  linter: LinterTools
  language: Languages
  root: string
  husky: HuskyConfig
}) {
  if (husky.commit_lint || husky.code_lint) {
    const huskyDir = path.resolve(`${root}/.husky`)

    await makeDir(huskyDir)
  }

  if (husky.code_lint) {
    const huskyPreCommitConfig = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
    
npx lint-staged
`

    const buildLintCommand = () => {
      if (linter === 'eslint') {
        return "eslint --fix --file ${filenames.join(' ')} "
      }

      if (linter === 'biome') {
        return "biome lint --apply ${filenames.join(' ')} "
      }
    }

    const buildFormatCommand = () => {
      if (formatter === 'prettier') {
        return "prettier --write --file ${filenames.join(' ')} "
      }

      if (formatter === 'biome') {
        return "biome format --write ${filenames.join(' ')} "
      }
    }

    const lintstaged = `const path = require('path')

${
  formatter != null
    ? ` const buildFormatCommand = (filenames) => {
  return [\`${buildFormatCommand()}\`, \`git add \${filenames.join(' ')}\`]
}
\n`
    : ''
}
${
  linter != null
    ? `const buildLintCommand = (filenames) => {
  return [\`${buildLintCommand()}\`, \`git add \${filenames.join(' ')}\`]
}
\n`
    : ''
}

module.exports = {
  "*.{${language === 'javascript' ? 'js' : 'ts,js'}}": [${formatter != null ? 'buildFormatCommand' : ''}, ${
    linter != null ? 'buildLintCommand' : ''
  }]
}
`

    await fs.writeFile(path.join(root, '.husky/pre-commit'), huskyPreCommitConfig)
    await fs.writeFile(path.join(root, '.lintstagedrc.js'), lintstaged)
  }

  if (husky.commit_lint) {
    const commitlintConfig = `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [0],
    'body-max-line-length': [0],
  },
}`

    const huskyCommitConfig = `#!/usr/bin/env sh

. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit \${1}
`

    await fs.writeFile(path.join(root, '.husky/commit-msg'), huskyCommitConfig)

    await fs.writeFile(path.join(root, 'commitlint.config.js'), commitlintConfig)
  }

  if (husky.code_lint || husky.commit_lint) {
    execSync('chmod ug+x .husky/*', { stdio: 'ignore' })
  }
}

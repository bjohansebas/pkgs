import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { cyan } from 'picocolors'

import sortJson from 'sort-json'
import { FormatterTools, HuskyConfig, Languages, LinterTools, PackageManager } from '../types'
import { PackageJsonConfig } from '../types/package'

export async function writePackageJson({
  appName,
  linter,
  language,
  formatter,
  husky,
  root,
}: {
  appName: string
  linter: LinterTools
  formatter: FormatterTools
  root: string
  language: Languages
  husky: HuskyConfig
}) {
  const packageJsonConfig: PackageJsonConfig = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  }

  if (language === 'typescript') {
    packageJsonConfig.scripts.build = 'tsc'

    packageJsonConfig.devDependencies.typescript = '^5'
    packageJsonConfig.devDependencies['@types/node'] = '^20'
  }

  if (husky.code_lint || husky.commit_lint) {
    packageJsonConfig.scripts.prepare = 'npx husky install'

    packageJsonConfig.devDependencies.husky = '^8'

    if (husky.code_lint) {
      packageJsonConfig.devDependencies['lint-staged'] = '^15'
    }

    if (husky.commit_lint) {
      packageJsonConfig.devDependencies['@commitlint/cli'] = '^18.4'
      packageJsonConfig.devDependencies['@commitlint/config-conventional'] = '^18.4'
    }
  }

  if (linter != null) {
    if (linter === 'eslint') {
      packageJsonConfig.devDependencies.eslint = '^8'

      if (language === 'typescript') {
        packageJsonConfig.scripts.lint = 'eslint "src/**/*.ts" --fix'

        packageJsonConfig.devDependencies['@typescript-eslint/eslint-plugin'] = '^6'
        packageJsonConfig.devDependencies['@typescript-eslint/parser'] = '^6'
      }

      if (language === 'javascript') packageJsonConfig.scripts.lint = 'eslint "src/**/*.js" --fix'
    }

    if (linter === 'biome') {
      packageJsonConfig.devDependencies['@biomejs/biome'] = '^1'
      packageJsonConfig.scripts.lint = 'biome lint . --apply'
    }
  }

  if (formatter != null) {
    if (formatter === 'prettier') {
      packageJsonConfig.devDependencies.prettier = '^3'

      if (language === 'typescript') packageJsonConfig.scripts.format = 'prettier --write "src/**/*.ts"'
      if (language === 'javascript') packageJsonConfig.scripts.format = 'prettier --write "src/**/*.js"'
    }

    if (formatter === 'biome') {
      packageJsonConfig.devDependencies['@biomejs/biome'] = '^1'
      packageJsonConfig.scripts.format = 'biome format . --write'
    }
  }

  const sortScripts = sortJson(packageJsonConfig.scripts, {})
  packageJsonConfig.scripts = sortScripts

  const sortDevDeps = sortJson(packageJsonConfig.devDependencies, {})
  packageJsonConfig.devDependencies = sortDevDeps

  const sortPackDeps = sortJson(packageJsonConfig.dependencies, {})
  packageJsonConfig.dependencies = sortPackDeps

  const devDeps = Object.keys(packageJsonConfig.devDependencies).length
  const packDeps = Object.keys(packageJsonConfig.dependencies).length

  if (packDeps) {
    console.log('\nInstalling dependencies:')
    for (const dependency in packageJsonConfig.dependencies) console.log(`- ${cyan(dependency)}`)
  }

  if (devDeps) {
    console.log('\nInstalling devDependencies:')
    for (const dependency in packageJsonConfig.devDependencies) console.log(`- ${cyan(dependency)}`)
  }

  console.log()

  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJsonConfig, null, 2) + os.EOL)

  console.log()
}

import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { cyan } from 'picocolors'

import { FormatterTools, Languages, LinterTools, PackageManager } from '../types'
import { PackageJsonConfig } from '../types/package'
import { installPackages } from '../utils/package'

export async function writePackageJson({
  appName,
  linter,
  language,
  formatter,
  packageManager,
  root,
  isOnline,
}: {
  appName: string
  linter: LinterTools
  formatter: FormatterTools
  root: string
  packageManager: PackageManager
  isOnline: boolean
  language: Languages
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
      packageJsonConfig.scripts.lint = '@biomejs/biome lint . --apply'
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
      packageJsonConfig.scripts.format = '@biomejs/biome format . --write'
    }
  }

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

  await installPackages(packageManager, isOnline)

  console.log()
}

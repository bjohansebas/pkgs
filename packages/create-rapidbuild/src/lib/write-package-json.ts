import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { cyan } from 'picocolors'

import { FormatterTools, LinterTools } from '../types'
import { PackageJsonConfig } from '../types/package'
import { PackageManager, installPackages } from '../utils/package'

export async function writePackageJson({
  appName,
  linter,
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
}) {
  const packageJsonConfig: PackageJsonConfig = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  }

  if (linter != null) {
    if (linter === 'eslint') {
      packageJsonConfig.devDependencies.eslint = '^8'
      packageJsonConfig.scripts.lint = 'eslint "src/**/*.{ts,js,tsx,jsx}" --fix'
    }

    if (linter === 'biome') {
      packageJsonConfig.devDependencies['@biomejs/biome'] = '^1'
      packageJsonConfig.scripts.lint = '@biomejs/biome lint . --apply'
    }
  }

  if (formatter != null) {
    if (formatter === 'prettier') {
      packageJsonConfig.devDependencies.prettier = '^3'
      packageJsonConfig.scripts.format = 'prettier --write "src/**/*.{ts,js,tsx,jsx}"'
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

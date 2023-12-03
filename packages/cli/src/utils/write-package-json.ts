import os from 'os'
import path from 'path'
import fs from 'fs/promises'

import { cyan } from 'picocolors'

import { PackageJsonConfig } from '../types/package'

export async function writePackageJson({
  appName,
  linter,
  formatter,
  root,
}: { appName: string; linter: string; formatter: string; root: string }) {
  const packageJsonConfig: PackageJsonConfig = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  }

  if (linter !== '') {
    if (linter === 'eslint') {
      packageJsonConfig.devDependencies.eslint = '^8'
    }

    if (linter === 'biome') {
      packageJsonConfig.devDependencies['@biomejs/biome'] = '^1'
    }
  }

  if (formatter !== '') {
    if (formatter === 'prettier') {
      packageJsonConfig.devDependencies.prettier = '^3'
    }

    if (formatter === 'biome') {
      packageJsonConfig.devDependencies['@biomejs/biome'] = '^1'
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
}

import fs from 'fs'
import path from 'path'

import { blue, green, yellow } from 'picocolors'
import validateProjectName from 'validate-npm-package-name'

import { EMOJIS } from '../ui/emojis'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export function getPkgManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent || ''

  if (userAgent.startsWith('yarn')) {
    return 'yarn'
  }

  if (userAgent.startsWith('pnpm')) {
    return 'pnpm'
  }

  if (userAgent.startsWith('bun')) {
    return 'bun'
  }

  return 'npm'
}

export function validateNpmName(name: string): {
  valid: boolean
  problems?: string[]
} {
  const nameValidation = validateProjectName(name)

  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  }
}

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'yarnrc.yml',
    '.yarn',
  ]

  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // Support IntelliJ IDEA-based editors
    .filter((file) => !/\.iml$/.test(file))

  if (conflicts.length > 0) {
    console.log(`The directory ${green(name)} contains files that could conflict:`)
    console.log()
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file))
        if (stats.isDirectory()) {
          console.log(`  ${EMOJIS.FOLDER} ${blue(file)}/`)
        } else {
          console.log(`  ${EMOJIS.FILE} ${yellow(file)}`)
        }
      } catch {
        console.log(`  ${EMOJIS.FILE} ${yellow(file)}`)
      }
    }
    console.log()
    console.log('Either try using a new directory name, or remove the files listed above.')
    console.log()
    return false
  }

  return true
}

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK)
    return true
  } catch (err) {
    return false
  }
}

export function makeDir(root: string, options = { recursive: true }): Promise<string | undefined> {
  return fs.promises.mkdir(root, options)
}

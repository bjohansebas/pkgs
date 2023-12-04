#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

import { Command, Option } from 'commander'
import { bold, cyan, green, red } from 'picocolors'
import prompts from 'prompts'

import packageJson from '../package.json'
import { createApp } from './create-app'
import { type ConfigApp } from './types'
import { isFolderEmpty, validateNpmName } from './utils'

let projectPath = ''

const handleSigTerm = () => process.exit(0)

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const onPromptState = (state: any) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h')
    process.stdout.write('\n')
    process.exit(1)
  }
}

const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments('[project-directory]')
  .usage(`${green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name
  })
  .addOption(
    new Option('--formatter <formatter>', 'Select the formatter tool of your preference.').choices([
      'biome',
      'prettier',
    ]),
  )
  .addOption(new Option('--linter <linter>', 'Select the linter tool of your preference.').choices(['biome', 'eslint']))

  .allowUnknownOption()
  .parse(process.argv)

async function run(): Promise<void> {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return `Invalid project name: ${validation.problems?.[0]}`
      },
    })

    if (typeof res.path === 'string') {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    console.log(
      `\nPlease specify the project directory:\n  ${cyan(program.name())} ${green(
        '<project-directory>',
      )}\nFor example:\n  ${cyan(program.name())} ${green('my-app')}\n\nRun ${cyan(
        `${program.name()} --help`,
      )} to see all options.`,
    )

    process.exit(1)
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const { valid, problems } = validateNpmName(projectName)

  if (!valid) {
    console.error(`Could not create a project called ${red(`"${projectName}"`)} because of npm naming restrictions:`)

    if (problems != null) {
      for (const p of problems) {
        console.error(`    ${red(bold('*'))} ${p}`)
      }
    }

    process.exit(1)
  }

  /**
   * Verify the project dir is empty or doesn't exist
   */
  const root = path.resolve(resolvedProjectPath)
  const appName = path.basename(root)
  const folderExists = fs.existsSync(root)

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const config: ConfigApp = {
    appPath: resolvedProjectPath,
    formatter: program.opts().formatter === 'biome' ? 'biome' : 'prettier',
    linter: program.opts().linter === 'biome' ? 'biome' : 'eslint',
    packageManager: 'npm',
  }

  if (!process.argv.includes('--linter')) {
    const { linter } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'linter',
      message: 'Which linter tool would you like to use?',
      choices: [
        { title: 'Biome', value: 'biome' },
        { title: 'ESLint', value: 'eslint' },
        { title: 'None of these', value: 'none' },
      ],
    })

    config.linter = linter === 'biome' ? 'biome' : linter === 'eslint' ? 'eslint' : null
  }

  if (!process.argv.includes('--formatter')) {
    const { formatter } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'formatter',
      message: 'Which formatter tool would you like to use?',
      choices: [
        { title: 'Biome', value: 'biome' },
        { title: 'Prettier', value: 'prettier' },
        { title: 'None of these', value: 'none' },
      ],
    })

    config.formatter = formatter === 'biome' ? 'biome' : formatter === 'prettier' ? 'prettier' : null
  }

  await createApp(config)
}

run()

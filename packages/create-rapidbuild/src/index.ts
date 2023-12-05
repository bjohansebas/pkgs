#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

import { Command, Option } from 'commander'
import { blue, bold, cyan, green, magenta, red, yellow } from 'picocolors'
import prompts from 'prompts'

import packageJson from '../package.json'
import { createApp } from './create-app'
import { type ConfigApp } from './types'
import { isFolderEmpty, validateNpmName } from './utils'
import { MESSAGES } from './utils/constants/messages'

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
  .addOption(new Option('--ts, --typescript', 'Initialize as a TypeScript project'))
  .addOption(new Option('--js, --javascript', 'Initialize as a JavaScript project.'))
  .addOption(
    new Option('--formatter <formatter>', 'Select the formatter tool of your preference.').choices([
      'biome',
      'prettier',
    ]),
  )
  .addOption(new Option('--linter <linter>', 'Select the linter tool of your preference.').choices(['biome', 'eslint']))
  .addOption(
    new Option('-p, --package-manager <package manager>', 'Select the package manager of your preference.').choices([
      'npm',
      'pnpm',
      'bun',
      'yarn',
    ]),
  )
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
    packageManager: program.opts().packageManager ?? 'npm',
    language: program.opts().typescript ? 'typescript' : 'javascript',
    vscode: {
      extensions: false,
      settings: false,
    },
  }

  if (
    (!process.argv.includes('--typescript') && !process.argv.includes('--javascript')) ||
    (process.argv.includes('--typescript') && process.argv.includes('--javascript'))
  ) {
    const styledTypeScript = blue('TypeScript')

    const { typescript } = await prompts(
      {
        type: 'toggle',
        name: 'typescript',
        message: `Would you like to use ${styledTypeScript}?`,
        active: 'Yes',
        inactive: 'No',
      },
      {
        onCancel: () => {
          console.log(`${red('✖')} Operation cancelled`)
          process.exit(1)
        },
      },
    )

    config.language = typescript ? 'typescript' : 'javascript'
  }

  /**
   * Checks if the `--linter` option is included in the command line arguments.
   * If not included, prompts the user to select a linter tool from a list of choices
   * and assigns the selected linter to the `config.linter` variable.
   */
  if (!process.argv.includes('--linter')) {
    const { linter } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'linter',
      message: 'Which linter tool would you like to use?',
      choices: [
        { title: yellow('Biome'), value: 'biome' },
        { title: magenta('ESLint'), value: 'eslint' },
        { title: 'None of these', value: 'none' },
      ],
    })

    config.linter = linter === 'biome' ? 'biome' : linter === 'eslint' ? 'eslint' : null
  }

  /**
   * Checks if the `--formatter` option is included in the command line arguments.
   * If not included, prompts the user to select a formatter tool from a list of choices
   * and assigns the selected formatter to the `config.formatter` variable.
   */
  if (!process.argv.includes('--formatter')) {
    const { formatter } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'formatter',
      message: 'Which formatter tool would you like to use?',
      choices: [
        { title: yellow('Biome'), value: 'biome' },
        { title: green('Prettier'), value: 'prettier' },
        { title: 'None of these', value: 'none' },
      ],
    })

    config.formatter = formatter === 'biome' ? 'biome' : formatter === 'prettier' ? 'prettier' : null
  }

  if (config.formatter != null || config.linter != null) {
    const { settings } = await prompts(
      {
        type: 'multiselect',
        name: 'settings',
        message: `How would you like to optimize your ${blue('VSCode')}?`,
        choices: [
          { title: 'Create configuration file', value: 'settings' },
          {
            title: 'Install recommended extensions',
            value: 'extensions',
          },
        ],
      },
      {
        onCancel: () => {
          console.log(`${red('✖')} Operation cancelled`)
          process.exit(1)
        },
      },
    )

    if (Array.isArray(settings)) {
      if (settings.includes('extensions')) config.vscode.extensions = true
      if (settings.includes('settings')) config.vscode.settings = true
    }
  }

  /**
   * Checks if the `--package-manager` or `-p` flag is present in the command line arguments.
   * If the flag is not present, prompts the user to select a package manager using the `prompts` library
   * and assigns the selected package manager to the `config.packageManager` variable.
   */
  if (!process.argv.includes('--package-manager') && !process.argv.includes('-p')) {
    const { packageManager } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'packageManager',
      message: MESSAGES.PACKAGE_MANAGER_QUESTION,
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'bun', value: 'bun' },
      ],
    })

    config.packageManager = packageManager
  }

  await createApp(config)
}

run().catch(async (reason) => {
  console.log()
  console.log('Aborting installation.')
  console.log()
  if (reason.command) {
    console.log(`  ${cyan(reason.command)} has failed.`)
  } else {
    console.log(`${red('Unexpected error. Please report it as a bug:')}\n`, reason)
  }
  console.log()

  process.exit(1)
})

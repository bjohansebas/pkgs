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
  .addOption(new Option('--ts, --typescript', 'Initialize as a TypeScript project. (default)'))
  .addOption(new Option('--js, --javascript', 'Initialize as a JavaScript project.'))
  .addOption(new Option('--tailwind', 'Initialize with Tailwind CSS config. (default)'))
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
    language: program.opts().javascript ? 'javascript' : 'typescript',
    vscode: {
      extensions: false,
      settings: false,
    },
    husky: {
      code_lint: false,
      commit_lint: false,
    },
    tailwind: Boolean(program.opts().tailwind),
    typescript: {
      importAlias: program.opts().typescript ? '@/*' : null,
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
        initial: true,
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

    config.language = Boolean(typescript) ? 'typescript' : 'javascript'
  }

  if (!process.argv.includes('--tailwind') && !process.argv.includes('--no-tailwind')) {
    const { tailwind } = await prompts({
      onState: onPromptState,
      type: 'toggle',
      name: 'tailwind',
      message: `Would you like to use ${blue('Tailwind CSS')}?`,
      initial: true,
      active: 'Yes',
      inactive: 'No',
    })

    config.tailwind = Boolean(tailwind)
  }

  if (config.language === 'typescript') {
    const { customizeImportAlias } = await prompts({
      onState: onPromptState,
      type: 'toggle',
      name: 'customizeImportAlias',
      message: `Would you like to customize the default ${blue('import alias')} (@/*)?`,
      active: 'Yes',
      inactive: 'No',
    })

    if (customizeImportAlias) {
      const { importAlias } = await prompts({
        onState: onPromptState,
        type: 'text',
        name: 'importAlias',
        message: `What ${blue('import alias')} would you like configured?`,
        initial: '@/*',
        validate: (value) => (/.+\/\*/.test(value) ? true : 'Import alias must follow the pattern <prefix>/*'),
      })

      config.typescript.importAlias = importAlias
    } else {
      config.typescript.importAlias = '@/*'
    }
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

  const { husky } = await prompts(
    {
      onState: onPromptState,
      type: 'multiselect',
      name: 'husky',
      message: `How would you like to set up ${blue('Husky')}?`,
      choices: [
        {
          title: 'Check your code before each commit (using a linter).',
          value: 'linter-code',
          disabled: !Boolean(config.formatter || config.linter),
        },
        {
          title: 'Use a linter for commit messages.',
          value: 'linter-commit',
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

  if (Array.isArray(husky)) {
    if (husky.includes('linter-commit')) {
      config.husky.commit_lint = true
    }

    if (husky.includes('linter-code')) {
      config.husky.code_lint = true
    }
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

#!/usr/bin/env node

import { Argument, Command, Option } from 'commander'
import Conf from 'conf'
import { green } from 'picocolors'

import packageJson from '../package.json'
import { configCommand } from './commands/config'
import { scannerCommand } from './commands/scan'
import { checkUpdates } from './utils/checkUpdates'

export const conf = new Conf({
  projectName: 'rapidapp',
  schema: {
    scanner: {
      type: 'object',
      default: { checkDependencies: true, checkContent: true },
    },
    general: {
      type: 'object',
      default: {
        mode: 'quite',
      },
    },
  },
})

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${green('[command]')} ${green('[options]')}`)
  .addOption(
    new Option('-m, --mode <arg>', 'select the mode in which the information will be printed.').choices([
      'quite',
      'verbose',
    ]),
  )
  .hook('postAction', async () => {
    await checkUpdates()
  })

program
  .command('config')
  .addArgument(new Argument('[command]', 'get global options for commands').choices(['general', 'scanner', 'all']))
  .option('--reset', 'explicitly tell the CLI to reset any stored preferences')
  .action(configCommand)

// program
//   .command('add')
//   .argument('[project-directory]')
//   .addOption(new Option('--formatter, -f [tool]').choices(['biome', 'prettier']))
//   // TODO: support oxc
//   .addOption(new Option('--linter, -l [tool]').choices(['eslint', 'oxc', 'biome']))
//   // TODO: support git hooks
//   .action(addCommand)
//   .allowUnknownOption()

//TODO: add option --output -o support csv, json yaml html table
program
  .command('scan')
  .argument('[project-directory]')
  .option('--no-check-content')
  .option('--check-content')
  .option('--check-dependencies')
  .option('--no-check-dependencies')
  .action(scannerCommand)
  .allowUnknownOption()

program.parse(process.argv)

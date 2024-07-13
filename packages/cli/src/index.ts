#!/usr/bin/env node

import { Argument, Command } from 'commander'
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
  },
})

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${green('[command]')} ${green('[options]')}`)
  .hook('postAction', async () => {
    await checkUpdates()
  })

program
  .command('config')
  // TODO: support all option
  .addArgument(new Argument('[command]', 'get global options for commands').choices(['scanner', 'all']))
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
//TODO: add option --verbose --quite
program
  .command('scan')
  .argument('[project-directory]')
  .option('-m, --mode <arg>', 'select the mode in which the information will be printed.')
  .option('--no-check-content')
  .option('--check-content')
  .option('--check-dependencies')
  .option('--no-check-dependencies')
  .action(scannerCommand)
  .allowUnknownOption()

program.parse(process.argv)

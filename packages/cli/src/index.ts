#!/usr/bin/env node

import { Command } from 'commander'
import { green } from 'picocolors'

import packageJson from '../package.json'
import { scannerCommand } from './commands/scan'

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${green('[command]')} ${green('[options]')}`)

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
program.command('scan').argument('[project-directory]').action(scannerCommand).allowUnknownOption()

program.parse(process.argv)

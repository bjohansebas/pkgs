#!/usr/bin/env node

import { Command, Option } from 'commander'
import { green } from 'picocolors'

import packageJson from '../package.json'
import { addCommand } from './commands/add'
import { scannerCommand } from './commands/scan'

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${green('[command]')} ${green('[options]')}`)

program
  .command('add')
  .addOption(new Option('--formatter, -f [tool]').choices(['biome', 'prettier']))
  .addOption(new Option('--linter, -l [tool]').choices(['eslint', 'oxc', 'biome']))
  .addOption(new Option('--git-hooks, -gh [tool]').choices(['husky', 'lefthook']))
  .action(addCommand)
  .allowUnknownOption()

program.command('scan').argument('<project-directory>').action(scannerCommand).allowUnknownOption()

program.parse(process.argv)

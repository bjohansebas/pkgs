#!/usr/bin/env node

import { Command, Option } from 'commander'
import packageJson from '../package.json'

const program = new Command(packageJson.name).version(packageJson.version)

program
  .command('add')
  .addOption(new Option('--formatter, -f').choices(['biome', 'prettier']))
  .addOption(new Option('--linter, -l').choices(['eslint', 'oxc', 'biome']))
  .addOption(new Option('--git-hooks, -gh').choices(['husky', 'lefthook']))

program.allowUnknownOption().parse(process.argv)

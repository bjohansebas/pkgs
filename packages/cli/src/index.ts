#!/usr/bin/env node

import { Command, Option } from 'commander'
import packageJson from '../package.json'

export const program = new Command(packageJson.name).version(packageJson.version)

program
  .command('add')
  .addOption(new Option('--formatter, -f [tool]').choices(['biome', 'prettier']))
  .addOption(new Option('--linter, -l [tool]').choices(['eslint', 'oxc', 'biome']))
  .addOption(new Option('--git-hooks, -gh [tool]').choices(['husky', 'lefthook']))
  .action(function () {
    const options = this.opts()

    // TODO: Show a prompt to select the tool to add
    if (Object.keys(options).length === 0) {
      return
    }

    if (options.L != null && options.L !== true) {
      console.log(options.L)
    }

    if (options.F != null && options.F !== true) {
      console.log(options.F)
    }

    if (options.Gh != null && options.Gh !== true) {
      console.log(options.Gh)
    }
  })

program.allowUnknownOption().parse(process.argv)

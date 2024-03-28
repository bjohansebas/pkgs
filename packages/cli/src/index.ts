#!/usr/bin/env node

import { generateReport, scanFolder } from '@rapidbuild/scanner'

import path from 'node:path'
import { Command, Option } from 'commander'
import { cyan, green } from 'picocolors'

import packageJson from '../package.json'

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .usage(`${green('[command]')} ${green('[options]')}`)

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
  .allowUnknownOption()

program
  .command('scan')
  .argument('<project-directory>')
  .action(async (name) => {
    const projectPath = name

    if (!projectPath) {
      console.log(
        `\nPlease specify the project directory:\n  ${cyan(program.name())} ${green(
          '<project-directory>',
        )}\nFor example:\n  ${cyan(program.name())} ${green('website')}\n\nRun ${cyan(
          `${program.name()} --help`,
        )} to see all options.`,
      )
      process.exit(1)
    }

    const resolvedProjectPath = path.resolve(projectPath)

    const files = await scanFolder(resolvedProjectPath)

    const report = generateReport({ files })

    console.log(report)
  })
  .allowUnknownOption()

program.parse(process.argv)

#!/usr/bin/env node

import path from 'node:path'
import { Command } from 'commander'
import { cyan, green } from 'picocolors'
import packageJson from '../package.json'
import { scanFolder } from './helpers/files'
import { generateReport } from './helpers/generate-report'

let projectPath = ''

export const program = new Command(packageJson.name)
  .version(packageJson.version)
  .argument('<project-directory>')
  .usage(`${green('<project-directory>')}`)
  .action((name) => {
    projectPath = name
  })
  .allowUnknownOption()
  .parse(process.argv)

async function run() {
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
}

run()

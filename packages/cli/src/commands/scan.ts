import path from 'node:path'

import { generateReport } from '@rapidapp/scanner'
import { scanFolder } from '@rapidapp/scanner/helpers'
import ora from 'ora'
import { cyan, green } from 'picocolors'

import { conf, program } from '../'

export const scannerCommand = async (
  name: string,
  options: { checkContent?: boolean; checkDependencies?: boolean },
) => {
  const spinner = ora('Scanning project')
  spinner.color = 'green'
  spinner.start()

  const preferencesScanner = (conf.get('scanner') || {}) as { checkContent?: boolean; checkDependencies?: boolean }
  const preferencesGeneral = (conf.get('general') || {}) as { mode?: 'verbose' | 'quite' }

  const projectPath = name || process.cwd()

  if (!projectPath) {
    console.log(
      `\nPlease specify the project directory:\n  ${cyan(program.name())} ${cyan('scan')} ${green(
        '<project-directory>',
      )}\nFor example:\n  ${cyan(program.name())} ${cyan('scan')} ${green('website')}\n\nRun ${cyan(
        `${program.name()} help`,
      )} ${green('scan')} to see all options.`,
    )
    process.exit(1)
  }

  if (program.opts().mode) {
    preferencesGeneral.mode = program.opts().mode
  }

  if (process.argv.includes('--check-content') || process.argv.includes('--no-check-content')) {
    preferencesScanner.checkContent = options.checkContent
  }

  if (process.argv.includes('--check-dependencies') || process.argv.includes('--no-check-dependencies')) {
    preferencesScanner.checkDependencies = options.checkDependencies
  }

  try {
    const resolvedProjectPath = path.resolve(projectPath)

    const files = await scanFolder(resolvedProjectPath)

    const report = await generateReport(files, {
      root: resolvedProjectPath,
      checkContent: preferencesScanner.checkContent ?? true,
      checkDependencies: preferencesScanner.checkDependencies ?? true,
      mode: preferencesGeneral.mode,
    })

    spinner.stop()

    console.dir(report, {
      depth: null,
      colors: true,
    })
  } catch {
    spinner.fail()
  } finally {
    conf.set('scanner', preferencesScanner)
    conf.set('general', preferencesGeneral)
  }
}

import path from 'node:path'

import { generateReport } from '@rapidapp/scanner'
import { scanFolder } from '@rapidapp/scanner/helpers'

import ora from 'ora'
import { cyan, green } from 'picocolors'

import { program } from '../'

export const scannerCommand = async (name: string) => {
  const spinner = ora('Scanning project')
  spinner.color = 'green'
  spinner.start()

  const projectPath = name

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

  try {
    const resolvedProjectPath = path.resolve(projectPath)

    const files = await scanFolder(resolvedProjectPath)

    const report = await generateReport(files, {
      root: resolvedProjectPath,
      checkContent: true,
    })

    spinner.stop()

    console.dir(report, {
      depth: null,
      colors: true,
    })
  } catch {
    spinner.fail()
  }
}

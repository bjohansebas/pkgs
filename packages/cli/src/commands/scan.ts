import path from 'node:path'
import { generateReport, scanFolder } from '@rapidbuild/scanner'
import { cyan, green } from 'picocolors'
import { program } from '../'

export const scannerCommand = async (name: string) => {
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

  const resolvedProjectPath = path.resolve(projectPath)

  const files = await scanFolder(resolvedProjectPath)

  const report = await generateReport(files)

  console.dir(report, {
    depth: null,
    colors: true,
  })
}

import { cyan, green } from 'picocolors'
import { program } from '../'

export function addCommand(name: string) {
  const projectPath = name
  const options = this.opts()

  if (!projectPath) {
    console.log(
      `\nPlease specify the project directory:\n  ${cyan(program.name())} ${cyan('add')} ${green(
        '<project-directory>',
      )} ${cyan('[tools]')}\nFor example:\n  ${cyan(program.name())} ${cyan('add')} ${green('website')} ${cyan(
        '--linter eslint',
      )}\n\nRun ${cyan(`${program.name()} help add`)} to see all options.`,
    )

    process.exit(1)
  }

  // TODO: Show a prompt to select the tool to add
  if (Object.keys(options).length === 0) {
    console.log(
      `\nPlease specify the tool to add:\n  ${cyan(program.name())} ${cyan('add <project-directory>')} ${green(
        '[tools]',
      )}\nFor example:\n  ${cyan(program.name())} ${cyan('add website')} ${green(
        '--linter eslint --formatter prettier',
      )}\n\nRun ${cyan(`${program.name()} help add`)} to see all options.`,
    )

    process.exit(1)
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
}

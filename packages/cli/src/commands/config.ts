import { cyan, green } from 'picocolors'
import { conf, program } from '..'

export const configCommand = async (name: 'scanner' | 'all', options: { reset?: boolean }) => {
  if (name == null) {
    console.log(
      `\nPlease specify the command:\n  ${cyan(program.name())} ${cyan('config')} ${green(
        '<command>',
      )}\nFor example:\n  ${cyan(program.name())} ${cyan('config')} ${green('scanner')}\n\nRun ${cyan(
        `${program.name()} help`,
      )} ${green('config')} to see all options.`,
    )

    process.exit(1)
  }

  if (name === 'all') {
    if (options?.reset) {
      conf.clear()

      console.log('Preferences reset successfully')
      return
    }

    console.dir({
      general: conf.get('general'),
      scanner: conf.get('scanner'),
    })

    return
  }

  if (options?.reset) {
    conf.delete(name)

    console.log('Preferences reset successfully')
    return
  }

  console.dir(conf.get(name) ?? {})
}

import { bold, cyan, yellow } from 'picocolors'
import checkForUpdate from 'update-check'

import packageJson from '../../package.json'

export async function checkUpdates(): Promise<void> {
  const userAgent = process.env.npm_config_user_agent || ''

  let packageManager = 'npm'

  if (userAgent.startsWith('yarn')) packageManager = 'yarn'

  if (userAgent.startsWith('pnpm')) packageManager = 'pnpm'

  if (userAgent.startsWith('bun')) packageManager = 'bun'

  try {
    const res = await checkForUpdate(packageJson).catch(() => null)

    if (res?.latest) {
      const updateMessage =
        packageManager === 'yarn'
          ? 'yarn global add rapidapp'
          : packageManager === 'pnpm'
            ? 'pnpm add -g rapidapp'
            : packageManager === 'bun'
              ? 'bun add -g rapidapp'
              : 'npm i -g rapidapp'

      console.log(
        `\n${yellow(bold('A new version of `rapidapp` is available!'))}\n\nYou can update by running: ${cyan(updateMessage)}\n`,
      )
    }

    process.exit()
  } catch {
    // ignore error
  }
}

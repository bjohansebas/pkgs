import spawn from 'cross-spawn'
import ora from 'ora'
import { bold, cyan, yellow } from 'picocolors'
import validateProjectName from 'validate-npm-package-name'

import { type PackageManager } from '../types'
import { EMOJIS } from '../ui/emojis'

export function validateNpmName(name: string): {
  valid: boolean
  problems?: string[]
} {
  const nameValidation = validateProjectName(name)

  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  }
}

/**
 * Spawn a package manager installation based on user preference.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export async function installPackages(
  /** Indicate which package manager to use. */
  packageManager: PackageManager,
  /** Indicate whether there is an active Internet connection.*/
  isOnline: boolean,
): Promise<void> {
  const args: string[] = ['install']
  if (!isOnline) {
    console.log(yellow('You appear to be offline.\nFalling back to the local cache.'))
    args.push('--offline')
  }
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise((resolve, reject) => {
    /**
     * Spawn the installation process.
     */
    const spinner = ora({
      text: `Installation in progress... ${EMOJIS.COFFEE}`,
    })

    spinner.start()

    const child = spawn(packageManager, args, {
      stdio: 'ignore',
      env: {
        ...process.env,
        ADBLOCK: '1',
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: 'development',
        DISABLE_OPENCOLLECTIVE: '1',
      },
    })

    const commandToRun = `${packageManager} ${args.join(' ')}`

    child.on('close', (code) => {
      if (code !== 0) {
        reject({ command: commandToRun })
        spinner.fail()

        console.error(
          `${
            EMOJIS.SCREAM
          }  Packages installation failed!\nIn case you don't see any errors above, consider manually running the failed command ${cyan(
            bold(commandToRun),
          )} to see more details on why it errored out.`,
        )

        return
      }

      spinner.succeed()
      resolve()

      return
    })
  })
}

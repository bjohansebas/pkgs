import { prettierFiles } from '@/constants'
import type { ConfigReport } from '..'

export async function resolvePrettier(files: string[], config: ConfigReport) {
  const pathConfig = files.find((file) => {
    const splitPath = file.split('/')

    return prettierFiles.find((prettierFile) => splitPath[splitPath.length - 1] === prettierFile)
  })

  if (!pathConfig) return false

  // TODO: verify if exist prettier key in package.json

  return true
}

import { async as glob } from 'fast-glob'
import { ignoreFiles } from '../constants'

export async function scanFolder(root: string): Promise<string[]> {
  const ignore = ignoreFiles

  const files = await glob('**/*', {
    cwd: root,
    dot: true,
    ignore,
    markDirectories: true,
  })

  return files
}

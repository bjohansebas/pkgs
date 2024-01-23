import fs from 'fs'
import path from 'path'
import { async as glob } from 'fast-glob'
import { parse } from 'parse-gitignore'

import { ignoreFiles } from './constants'

export async function scanFolder(root: string): Promise<string[]> {
  const ignorePath = path.join(root, '.gitignore')

  let ignore = ignoreFiles

  if (fs.existsSync(ignorePath)) {
    ignore = ['**/.git', ...parse(fs.readFileSync(ignorePath)).patterns.map((text) => `**/${text}`)]
  }

  const files = await glob('**/*', {
    cwd: root,
    dot: true,
    ignore,
    markDirectories: true,
  })

  return files
}

import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { TypeScriptConfig } from '../types'

export async function writeTypescriptConfig({
  root,
  typescript,
}: {
  root: string
  typescript: TypeScriptConfig
}) {
  const typescriptConfig = {
    compilerOptions: {
      target: 'ES2022',
      moduleResolution: 'node',
      strict: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      skipLibCheck: false,
      baseUrl: '.',
      paths: {
        [typescript.importAlias ?? '@/*']: ['src/*'],
      },
    },
    include: ['**/*.ts'],
    exclude: ['dist', 'node_modules', 'build'],
  }

  await fs.writeFile(path.join(root, 'tsconfig.json'), JSON.stringify(typescriptConfig, null, 2) + os.EOL)
}

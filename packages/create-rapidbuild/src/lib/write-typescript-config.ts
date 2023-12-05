import os from 'os'
import path from 'path'
import fs from 'fs/promises'

export async function writeTypescriptConfig({
  root,
}: {
  root: string
}) {
  const typescriptConfig = {
    compilerOptions: {
      target: 'ES2022',
      moduleResolution: 'node',
      strict: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      skipLibCheck: false,
    },
    include: ['src'],
    exclude: ['dist', 'node_modules'],
  }

  await fs.writeFile(path.join(root, 'tsconfig.json'), JSON.stringify(typescriptConfig, null, 2) + os.EOL)
}

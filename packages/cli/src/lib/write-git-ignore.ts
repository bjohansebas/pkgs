import os from 'os'
import path from 'path'
import fs from 'fs/promises'

export async function writeGitIgnore({
  root,
}: {
  root: string
}) {
  const gitIgnoreString: string = `# Created by RapidBuild
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
.pnp
.pnp.js

# Build Outputs
build
dist

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Misc
.DS_Store
*.pem

  `

  await fs.writeFile(path.join(root, '.gitignore'), gitIgnoreString + os.EOL)
}

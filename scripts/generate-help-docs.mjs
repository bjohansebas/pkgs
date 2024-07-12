import { execSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)

if (args.length === 0) {
  throw new Error('generate-help-docs.mjs: requires a least one parameter')
}

for (const arg of args) {
  const dir = resolve(arg)

  let output = execSync(`node ${dir}/dist/index.js --help`, {
    encoding: 'utf-8',
  })

  output = output.replace(/(?<=Usage: auth \[options\] \[command\]\n\n)[\s\S]*?(?=Options:)/, '')

  const readmePath = join(dir, 'README.md')
  const readme = await readFile(readmePath, 'utf-8')

  const updatedReadme = readme.replace(
    /(?<=<!-- GENERATED START -->\n\n```\n)[\s\S]*?(?=```\n\n<!-- GENERATED END -->)/,
    output,
  )

  await writeFile(readmePath, updatedReadme, 'utf-8')
}

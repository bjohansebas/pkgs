import { rm } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)

if (args.length === 0) {
  throw new Error('rm.mjs: requires a least one parameter')
}

for (const arg of args) {
  const path = join(process.cwd(), arg)

  console.log(`rm.mjs: deleting path "${path}"`)

  await rm(path, { recursive: true, force: true })
}

// @ts-check
import { join } from 'path'
import { rm } from 'fs/promises'
import colors from 'picocolors'

const args = process.argv.slice(2)

if (args.length === 0) {
  throw new Error('rm.mjs: requires a least one parameter')
}

for (const arg of args) {
  const path = join(process.cwd(), arg)
  console.log(`rm.mjs: deleting path "${colors.cyan(path)}"`)
  await rm(path, { recursive: true, force: true })
}

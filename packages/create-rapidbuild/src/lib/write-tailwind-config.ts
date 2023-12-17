import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import { Languages, LinterTools } from '../types'
import { makeDir } from '../utils'

export async function writeTailwindCSSConfig({
  root,
  linter,
  language,
}: {
  root: string
  linter: LinterTools
  language: Languages
}) {
  const stylesDir = path.resolve(`${root}/src/styles`)

  await makeDir(stylesDir)

  const postCssString: string = `${linter === 'eslint' ? '/* eslint-env node */\n' : ''}module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}`

  const tailwindString: string = `${linter === 'eslint' && language === 'javascript' ? '/* eslint-env node */\n' : ''}/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}`

  const globalsCssString: string = `@tailwind base;
@tailwind components;
@tailwind utilities;`

  await fs.writeFile(path.join(root, 'postcss.config.js'), postCssString + os.EOL)
  await fs.writeFile(
    path.join(root, `tailwind.config.${language === 'typescript' ? 'ts' : 'js'}`),
    tailwindString + os.EOL,
  )
  await fs.writeFile(path.join(stylesDir, 'globals.css'), globalsCssString + os.EOL)
}

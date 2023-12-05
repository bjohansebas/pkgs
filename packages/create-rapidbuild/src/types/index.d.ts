export type FormatterTools = 'biome' | 'prettier' | null

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export type Languages = 'javascript' | 'typescript'

export type LinterTools = 'biome' | 'eslint' | null

export interface VSCodeConfig {
  extensions: boolean
  settings: boolean
}

export interface ConfigApp {
  appPath: string
  linter: LinterTools
  language: Languages
  formatter: FormatterTools
  packageManager: PackageManager
  vscode: VSCodeConfig
}

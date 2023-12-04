export type FormatterTools = 'biome' | 'prettier' | null

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export type LinterTools = 'biome' | 'eslint' | null

export interface ConfigApp {
  appPath: string
  linter: LinterTools
  formatter: FormatterTools
  packageManager: PackageManager
}

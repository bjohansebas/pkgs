import type { PathLike } from 'node:fs'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun' | 'deno'

export type Languages = 'javascript' | 'typescript'

export type Linters = 'biome' | 'eslint' | 'oxc'
export type Formatters = 'biome' | 'prettier'

export interface Css {
  preprocessor: 'sass' | 'less' | 'stylus' | 'postcss'
  framework: 'tailwindcss' | 'bootstrap'
}

export type CI = 'github' | 'travis'

export interface Monorepo {
  name: 'turborepo' | 'nx'
}

export interface Project extends Package {
  packages?: Package[]
  package_manager: PackageManager[] | null
  // monorepo: null | Monorepo
  // ci: string
  // git_hooks: string
}

export interface Package {
  languages: Languages[] | null
  linters: Linters[] | null
  formatter: Formatters[] | null
  // css: string[]
  // frameworks: string[]
  // database: string
}

export interface PackageJson {
  path: PathLike
  name?: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  prettier?: object
  eslintConfig?: object
}

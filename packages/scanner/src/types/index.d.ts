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

export interface Project {
  languages: Languages[] | null
  package_manager: PackageManager[] | null
  linters: Linters[] | null
  formatter: Formatters[] | null
  // css: string[]
  // frameworks: string[]
  // monorepo: null | Monorepo
  // git_hooks: string
  // database: string
  // ci: string
}

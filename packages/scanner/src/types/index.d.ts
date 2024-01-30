export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export type Languages = 'javascript' | 'typescript'

export interface Css {
  preprocessor: 'sass' | 'less' | 'stylus' | 'postcss'
  framework: 'tailwindcss' | 'bootstrap'
}

export type CI = 'github' | 'travis'

export interface Monorepo {
  name: 'turborepo' | 'nx'
}

export interface Project {
  // languages: Languages[]
  // css: string[]
  // frameworks: string[]
  // monorepo: null | Monorepo
  // git_hooks: string
  // database: string
  // lint: string[]
  // formatter: string[]
  package_manager?: PackageManager
  // ci: string
}

export interface BiomeConfig {
  path?: string
  formatter?: boolean
  linter?: boolean
  installed?: boolean
}

export interface PrettierConfig {
  path?: string | null
  config?: boolean
  installed?: boolean
}
export interface ESLintConfig {
  path?: string | null
  config?: boolean
  installed?: boolean
}

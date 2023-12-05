export interface ESLintConfig {
  env: {
    browser?: boolean
    es2021?: boolean
  }
  extends?: string | string[]
  parser?: string
  parserOptions: {
    ecmaVersion?: 'latest' | string
    sourceType?: 'module' | 'script'
  }
  plugins?: string[]
  rules: object
}

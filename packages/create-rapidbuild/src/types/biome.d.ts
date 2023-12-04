export interface BiomeConfig {
  $schema: string
  formatter?: {
    enabled: boolean
    indentStyle?: 'space' | 'tab'
    indentWidth?: number
    lineWidth?: number
  }
  linter?: {
    enabled: boolean
    rules?: {
      recommended: boolean
    }
  }
  organizeImports?: {
    enabled: boolean
  }
  vcs?: {
    clientKind: 'git'
    enabled: boolean
    useIgnoreFile: boolean
  }
}

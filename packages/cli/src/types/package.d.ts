export interface PackageJsonConfig {
  name: string
  version: string
  devDependencies: Record<string, string>
  dependencies: Record<string, string>
  scripts: Record<string, string>
  private: boolean
}

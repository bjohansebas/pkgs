import { resolveBiomeConfig } from '@/utils/biome'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('resolve biome config', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
  })

  it('should handle nested file paths correctly', async () => {
    const files = ['some/nested/folder/biome.json']
    const config = { root: '/project', checkContent: true, checkDependencies: true }
    const content = { biomeContent: '{"formatter":{"enabled":true},"linter":{"enabled":false}}' }
    const packageJson = { path: '', dependencies: { '@biomejs/biome': '^1.0.0' } }

    const result = await resolveBiomeConfig(files, config, { packageJson, biomeContent: content.biomeContent })

    expect(result).toEqual({
      path: '/project/some/nested/folder/biome.json',
      formatter: true,
      linter: false,
      installed: true,
    })
  })
  it('should return biomeConfig with formatter and linter enabled when pathConfig is found', async () => {
    const files = ['path/to/biome.json']

    const config = { root: '/root', checkContent: false }
    const result = await resolveBiomeConfig(files, config)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: true,
      linter: true,
      installed: true,
    })
  })

  it('should return null when no biome config file is found in files', async () => {
    const files = ['some/other/file.txt']
    const config = { root: '/project', checkContent: false, checkDependencies: false }

    const result = await resolveBiomeConfig(files, config)

    expect(result).toBeNull()
  })

  it('should return null when files array is empty', async () => {
    const config = { root: '/root', checkDependencies: false, checkContent: false }

    const result = await resolveBiomeConfig([], config)
    expect(result).toBeNull()
  })

  it('should return biomeConfig with formatter and linter enabled when checkContent is true', async () => {
    const files = ['path/to/biome.json']

    const config = { root: '/root', checkContent: true }
    const content = { biomeContent: '{"formatter": {"enabled": true},"linter": {"enabled": true}}' }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: true,
      linter: true,
      installed: true,
    })
  })

  describe.each(['development', 'test'])('NODE_ENV=%s', async (enviroment) => {
    it.each([true, false])(`NODE_ENV=${enviroment} should set installed to %s`, async (value) => {
      vi.stubEnv('NODE_ENV', enviroment)

      const files = ['path/to/biome.json']
      const config = { root: '/root', checkDependencies: value, checkContent: false }
      const content = {
        packageJson: { path: '', dependencies: { '@biomejs/biome': '1' } },
      }
      const result = await resolveBiomeConfig(files, config, content)

      expect(result).toEqual({
        path: '/root/path/to/biome.json',
        installed: value,
        formatter: true,
        linter: true,
      })
    })
  })

  it('NODE_ENV=development should set installed to false when checkDependencies is missing', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const files = ['path/to/biome.json']
    const config = { root: '/root', checkContent: false }
    const content = { packageJson: null, biomeContent: '{}' }
    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: true,
      linter: true,
      installed: false,
    })
  })

  it('NODE_ENV=test should set installed to true when checkDependencies is missing', async () => {
    const files = ['path/to/biome.json']
    const config = { root: '/root', checkContent: false }
    const result = await resolveBiomeConfig(files, config)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: true,
      linter: true,
      installed: true,
    })
  })

  it('should set installed to true if @biomejs/biome is found in packageJson dependencies', async () => {
    const files = ['biome.json']
    const config = { root: '/project', checkContent: false, checkDependencies: true }
    const packageJson = { path: '', dependencies: { '@biomejs/biome': '^1.0.0' } }
    const content = { packageJson }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/project/biome.json',
      formatter: true,
      linter: true,
      installed: true,
    })
  })

  it('should set installed to true if @biomejs/biome is missing in packageJson dependencies', async () => {
    const files = ['biome.json']
    const config = { root: '/project', checkContent: false, checkDependencies: true }
    const packageJson = { path: '', dependencies: { prettier: '^1.0.0' } }
    const content = { packageJson }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/project/biome.json',
      formatter: true,
      linter: true,
      installed: false,
    })
  })

  it('should return default biome config when content is invalid JSON', async () => {
    const files = ['biome.json']
    const config = { root: '/project', checkContent: true }
    const biomeContent = { biomeContent: '{invalid JSON}' }
    const packageJson = { path: '', name: 'test-package', version: '1.0.0' }

    const result = await resolveBiomeConfig(files, config, { packageJson, biomeContent: biomeContent.biomeContent })

    expect(result).toEqual({
      path: '/project/biome.json',
      formatter: false,
      linter: false,
      installed: true,
    })
  })

  it('should return biomeConfig with installed set to false when both checkContent and checkDependencies are false', async () => {
    const files = ['biome.json']
    const config = { root: '/project', checkContent: false, checkDependencies: false }
    const content = { biomeContent: '{"formatter": {"enabled": true}, "linter": {"enabled": true}}' }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/project/biome.json',
      formatter: true,
      linter: true,
      installed: false,
    })
  })

  it('should return formatter disabled when checkContent is true and formmater is disabled in content', async () => {
    const files = ['path/to/biome.json']

    const config = { root: '/root', checkContent: true }
    const content = { biomeContent: '{"formatter": {"enabled": false}}' }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: false,
      linter: undefined,
      installed: true,
    })
  })

  it('should return linter disabled when checkContent is true and linter is disabled in content', async () => {
    const files = ['path/to/biome.json']

    const config = { root: '/root', checkContent: true }
    const content = { biomeContent: '{"linter": {"enabled": false}}' }

    const result = await resolveBiomeConfig(files, config, content)

    expect(result).toEqual({
      path: '/root/path/to/biome.json',
      formatter: undefined,
      linter: false,
      installed: true,
    })
  })
})

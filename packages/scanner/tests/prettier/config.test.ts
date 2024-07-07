import path from 'node:path'
import { resolvePrettier } from '@/utils/prettier'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('resolve prettier config', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
  })

  it('should return config with path when prettier config file is found in files', () => {
    const files = ['src/.prettierrc']
    const config = { root: '/root' }
    const result = resolvePrettier(files, config)

    expect(result).toEqual({
      installed: true,
      config: true,
      path: path.join(config.root, 'src/.prettierrc'),
    })
  })

  it('should return null when no prettier config file is found and packageJson is null', () => {
    const files = ['src/index.js']
    const config = { root: '/' }
    const result = resolvePrettier(files, config, { packageJson: null })
    expect(result).toBeNull()
  })

  it('should return config with path when prettier config is found in packageJson', () => {
    const files = ['package.json']
    const config = { root: '/root' }
    const content = {
      packageJson: {
        prettier: {},
        path: 'root/package.json',
      },
    }

    const result = resolvePrettier(files, config, content)

    expect(result).toEqual({
      installed: true,
      config: true,
      path: 'root/package.json',
    })
  })

  it('should return null when files array is empty', () => {
    const config = { root: '/root', checkDepedencies: true }
    const result = resolvePrettier([], config)

    expect(result).toBe(null)
  })

  it('should return config with path and installed false when packageJson is missing and prettier config is found', () => {
    const files = ['src/.prettierrc']
    const config = { root: '/root', checkDepedencies: true }
    const result = resolvePrettier(files, config)

    expect(result).toEqual({
      path: '/root/src/.prettierrc',
      config: true,
      installed: false,
    })
  })

  it('should return config with path when prettier config file is found in packageJson', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/root', checkDepedencies: false }
    const content = {
      packageJson: {
        path: 'root/package.json',
        prettier: {},
      },
    }

    const result = resolvePrettier(files, config, content)

    expect(result).toEqual({
      installed: false,
      config: true,
      path: 'root/package.json',
    })
  })

  it('should return null when packageJson has no prettier field and dependencies field and prettier config is not found', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/root', checkDepedencies: true }
    const content = { packageJson: { path: 'package.json' } }
    const result = resolvePrettier(files, config, content)

    expect(result).toBeNull()
  })

  it('NODE_ENV=test should return installed true when checkDepedencies is missing', () => {
    const files = ['src/file1.ts', 'src/file2.ts', '.prettierrc']
    const config = { root: '/root' }

    const result = resolvePrettier(files, config)

    expect(result).toEqual({
      installed: true,
      config: true,
      path: '/root/.prettierrc',
    })
  })

  it('NODE_ENV=development should return installed false when checkDepedencies is missing', () => {
    vi.stubEnv('NODE_ENV', 'development')

    const files = ['src/file1.ts', 'src/file2.ts', '.prettierrc']
    const config = { root: '/root' }

    const result = resolvePrettier(files, config)

    expect(result).toEqual({
      installed: false,
      config: true,
      path: '/root/.prettierrc',
    })
  })

  it('should return config with installed flag set to true if prettier is a dependency', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/project', checkDepedencies: true }
    const content = {
      packageJson: {
        dependencies: { prettier: '^2.0.0' },
        path: '/project/package.json',
      },
    }

    const result = resolvePrettier(files, config, content)

    expect(result).toEqual({
      installed: true,
    })
  })

  it('should return config with installed flag set to false if prettier is not a dependency', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/project', checkDepedencies: true }

    const content = {
      packageJson: {
        dependencies: { '@biomejs/biome': '^2.0.0' },
        path: '/project/package.json',
      },
    }

    const result = resolvePrettier(files, config, content)

    expect(result).toEqual({
      installed: false,
    })
  })

  it('should return config with path when both dependencies and devDependencies are present in package.json', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/project', checkDepedencies: true }
    const content = {
      packageJson: {
        path: '/project/package.json',
        dependencies: { prettier: '^2.0.0' },
        devDependencies: { prettier: '^2.0.0' },
        prettier: {},
      },
    }

    const result = resolvePrettier(files, config, content)

    expect(result).toEqual({
      config: true,
      path: '/project/package.json',
      installed: true,
    })
  })
})

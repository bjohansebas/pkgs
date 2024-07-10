import path from 'node:path'
import { resolveESLint } from '@/utils/eslint'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('resolve eslint config', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
  })

  it('should return ESLintConfig with config and path when eslint file is found in files', () => {
    const files = ['src/.eslintrc.json']

    const config = { root: '/root' }

    const result = resolveESLint(files, config)

    expect(result).toEqual({
      config: true,
      path: path.join(config.root, 'src/.eslintrc.json'),
      installed: true,
    })
  })

  it('should return null when files array is empty and packageJson is null', () => {
    const config = { root: '/root' }
    const content = { packageJson: null }

    const result = resolveESLint([], config, content)

    expect(result).toBeNull()
  })

  it('should set installed to true when eslint is found in dependencies', () => {
    const files = ['package.json']
    const config = { root: '/root', checkDependencies: true }

    const content = { packageJson: { eslintConfig: {}, path: '/root/package.json', dependencies: { eslint: '9.0.0' } } }

    const result = resolveESLint(files, config, content)

    expect(result).toEqual({
      config: true,
      installed: true,
      path: path.join(config.root, 'package.json'),
    })
  })

  it('should set installed to false when eslint is not found in dependencies', () => {
    const files = ['package.json']
    const config = { root: '/root', checkDependencies: true }

    const content = { packageJson: { path: '/root/package.json', dependencies: { '@biomejs/biome': '9.0.0' } } }

    const result = resolveESLint(files, config, content)

    expect(result).toEqual({
      installed: false,
    })
  })

  it('should return null when no eslint file is found and packageJson is null', () => {
    const files = ['src/.lint']
    const config = { root: 'false' }
    const content = { packageJson: null }

    const result = resolveESLint(files, config, content)

    expect(result).toBeNull()
  })

  it('should return null when files array is empty', () => {
    const config = { root: '/root', checkDependencies: true }
    const result = resolveESLint([], config)

    expect(result).toBe(null)
  })

  it('should return config with path and installed false when packageJson is missing and prettier config is found', () => {
    const files = ['src/.eslintrc.json']
    const config = { root: '/root', checkDependencies: true }
    const result = resolveESLint(files, config)

    expect(result).toEqual({
      path: '/root/src/.eslintrc.json',
      config: true,
      installed: false,
    })
  })

  it('should return config with path when eslint config file is found in packageJson', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/root', checkDependencies: false }
    const content = {
      packageJson: {
        path: 'root/package.json',
        eslintConfig: {},
      },
    }

    const result = resolveESLint(files, config, content)

    expect(result).toEqual({
      installed: false,
      config: true,
      path: 'root/package.json',
    })
  })

  it('should return null when packageJson has no eslintConfig field and dependencies field and eslint config is not found', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/root', checkDependencies: true }
    const content = { packageJson: { path: 'package.json' } }
    const result = resolveESLint(files, config, content)

    expect(result).toBeNull()
  })

  it('NODE_ENV=test should return installed true when checkDependencies is missing', () => {
    const files = ['src/file1.ts', 'src/file2.ts', '.eslintrc.json']
    const config = { root: '/root' }

    const result = resolveESLint(files, config)

    expect(result).toEqual({
      installed: true,
      config: true,
      path: '/root/.eslintrc.json',
    })
  })

  it('NODE_ENV=development should return installed false when checkDependencies is missing', () => {
    vi.stubEnv('NODE_ENV', 'development')

    const files = ['src/file1.ts', 'src/file2.ts', '.eslintrc.json']
    const config = { root: '/root' }

    const result = resolveESLint(files, config)

    expect(result).toEqual({
      installed: false,
      config: true,
      path: '/root/.eslintrc.json',
    })
  })

  it('should return config with path when both dependencies and devDependencies are present in package.json', () => {
    const files = ['src/index.js', 'package.json']
    const config = { root: '/project', checkDependencies: true }
    const content = {
      packageJson: {
        path: '/project/package.json',
        dependencies: { eslint: '^9.0.0' },
        devDependencies: { eslint: '^9.0.0' },
        eslintConfig: {},
      },
    }

    const result = resolveESLint(files, config, content)

    expect(result).toEqual({
      config: true,
      path: '/project/package.json',
      installed: true,
    })
  })
})

import { getLinters } from '@/index'
import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'production')

describe('getLinters()', () => {
  describe('biome', () => {
    it('should return ["biome"] when biome is installed and linter is enabled and checkDependencies(true)', () => {
      const report = getLinters({
        biome: { linter: false, installed: true, path: '/root' },
        eslint: null,
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('eslint')
    })

    it("should return ['biome'] when biome isn't installed and linter is enabled, checkDependencies(false) and checkContent(true)", () => {
      const report = getLinters({
        biome: { linter: true, installed: false, path: '/projects/project' },
        eslint: null,
        config: { root: '/projects/project', checkDependencies: false, checkContent: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('eslint')
    })

    it('should return ["biome"] when biome is installed and linter is disabled, checkDependencies(true) and checkContent(false)', () => {
      const report = getLinters({
        biome: { linter: false, installed: true, path: '/projects/project' },
        eslint: null,
        config: { root: '/projects/project', checkDependencies: true, checkContent: false },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('eslint')
    })

    it('should return null when biome is installed and linter is disbled, checkDependencies(true) and checkContent(true)', () => {
      const report = getLinters({
        biome: { linter: false, installed: true, path: '/projects/project' },
        eslint: null,
        config: { root: '/projects/project', checkDependencies: true, checkContent: true },
      })

      expect(report).toBeNull()
    })

    it('should return null when biome linter is disabled and checkContent(true)', () => {
      const biome = { path: '/some/path', installed: false, linter: false }
      const eslint = null
      const config = { root: '/root', checkContent: true, checkDependencies: false }

      const result = getLinters({ biome, eslint, config })

      expect(result).toBeNull()
    })

    it('should return null when biome path is null', () => {
      const biome = { installed: true, linter: true }
      const eslint = null
      const config = { root: '/root', checkContent: false, checkDependencies: true }

      const result = getLinters({ biome, eslint, config })

      expect(result).toBeNull()
    })
  })

  describe('eslint', () => {
    it('should return ["eslint"] when eslint is installed and checkDependencies(true)', () => {
      const report = getLinters({
        biome: null,
        eslint: { installed: true },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).not.toContain('biome')
      expect(report).toContain('eslint')
    })

    it("should return ['eslint'] when eslint config is true, checkDependencies(false)", () => {
      const report = getLinters({
        biome: null,
        eslint: { config: true, path: 'ls' },
        config: { root: '/projects/project', checkDependencies: false },
      })

      expect(report).toContain('eslint')
      expect(report).not.toContain('biome')
    })

    it("should return null when eslint isn'n installed and config is not found, checkDependencies(true)", () => {
      const report = getLinters({
        biome: null,
        eslint: { installed: false, config: false },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toBeNull()
    })

    it("should return null when eslint isn'n installed and config is found, checkDependencies(true)", () => {
      const report = getLinters({
        biome: null,
        eslint: { config: true, path: '/ls', installed: false },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toBeNull()
    })

    it('should return null when eslint is null', () => {
      const biome = null
      const eslint = null
      const config = { root: '/root' }

      const result = getLinters({ biome, eslint, config })

      expect(result).toBeNull()
    })
  })

  it('should return null when both biome and eslint are null', () => {
    const biome = null
    const eslint = null
    const config = { root: '/root', checkContent: false, checkDependencies: false }

    const result = getLinters({ biome, eslint, config })

    expect(result).toBeNull()
  })

  it("should return ['biome', 'eslint'] when both biome and eslint conditions are met", () => {
    const biome = { path: '/some/path', installed: true, formatter: true }
    const eslint = { installed: true, config: false }
    const config = { root: '/some/path', checkContent: true, checkDependencies: true }

    const result = getLinters({ biome, eslint, config })

    expect(result).toEqual(['biome', 'eslint'])
  })

  it('should return null when biome and eslint do not meet any conditions', () => {
    const biome = { installed: false, formatter: false }
    const eslint = { path: null, installed: false, config: false }
    const config = { root: '/some/path', checkContent: true, checkDependencies: true }

    const result = getLinters({ biome, eslint, config })

    expect(result).toBeNull()
  })
})

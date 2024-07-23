import { getFormatters } from '@/helpers'
import type { ConfigReport } from '@/types'
import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'production')

describe('mode: quite', () => {
  describe('biome', () => {
    it('should return ["biome"] when biome is installed and formatter is true and checkDependencies(true)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/root' },
        prettier: null,
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it("should return ['biome'] when biome isn't installed and formatter is enabled, checkDependencies(false) and checkContent(true)", () => {
      const report = getFormatters({
        biome: { formatter: true, installed: false, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDependencies: false, checkContent: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it('should return ["biome"] when biome is installed and formatter is disabled, checkDependencies(true) and checkContent(false)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDependencies: true, checkContent: false },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it("should return ['biome'] when biome is installed and path not found, checkDependencies(true)", () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true },
        prettier: null,
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it('should return null when biome is installed and formatter is disbled, checkDependencies(true) and checkContent(true)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDependencies: true, checkContent: true },
      })

      expect(report).toBeNull()
    })

    it('should return null when biome formatter is disabled and checkContent(true)', () => {
      const biome = { path: '/some/path', installed: false, formatter: false }
      const prettier = null
      const config = { root: '/root', checkContent: true, checkDependencies: false }

      const result = getFormatters({ biome, prettier, config })

      expect(result).toBeNull()
    })

    it('should return null when biome path is null and checkDependencies(false)', () => {
      const biome = { installed: true, formatter: true }
      const prettier = null
      const config = { root: '/root', checkContent: false, checkDependencies: false }

      const result = getFormatters({ biome, prettier, config })

      expect(result).toBeNull()
    })
  })

  describe('prettier', () => {
    it('should return ["prettier"] when prettier is installed and checkDependencies(true)', () => {
      const report = getFormatters({
        biome: null,
        prettier: { installed: true },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).not.toContain('biome')
      expect(report).toContain('prettier')
    })

    it("should return ['prettier'] when prettier config is true, checkDependencies(false)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { config: true, path: 'ls' },
        config: { root: '/projects/project', checkDependencies: false },
      })

      expect(report).toContain('prettier')
      expect(report).not.toContain('biome')
    })

    it("should return null when prettier isn'n installed and config is not found, checkDependencies(true)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { installed: false, config: false },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toBeNull()
    })

    it("should return null when prettier isn'n installed and config is found, checkDependencies(true)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { config: true, path: '/ls', installed: false },
        config: { root: '/projects/project', checkDependencies: true },
      })

      expect(report).toBeNull()
    })

    it('should return null when prettier is null', () => {
      const biome = null
      const prettier = null
      const config = { root: '/root' }

      const result = getFormatters({ biome, prettier, config })

      expect(result).toBeNull()
    })
  })

  it('should return null when both biome and prettier are null', () => {
    const biome = null
    const prettier = null
    const config = { root: '/root', checkContent: false, checkDependencies: false }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toBeNull()
  })

  it("should return ['biome', 'prettier'] when both biome and prettier conditions are met", () => {
    const biome = { path: '/some/path', installed: true, formatter: true }
    const prettier = { installed: true, config: false }
    const config = { root: '/some/path', checkContent: true, checkDependencies: true }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toEqual(['biome', 'prettier'])
  })

  it('should return null when biome and prettier do not meet any conditions', () => {
    const biome = { installed: false, formatter: false }
    const prettier = { path: null, installed: false, config: false }
    const config = { root: '/some/path', checkContent: true, checkDependencies: true }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toBeNull()
  })
})

describe('mode: verbose', () => {
  it('should return both prettier and biome when config.mode is "verbose"', () => {
    const biome = { path: '/path/to/biome', installed: true, linter: true }
    const prettier = { config: false, installed: true }
    const config: ConfigReport = { mode: 'verbose', checkDependencies: true, checkContent: true, root: './project' }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toEqual({ prettier, biome })
  })

  it('should return null when no linters meet criteria and config.mode is not "verbose"', () => {
    const biome = { installed: true, linter: false }
    const prettier = { config: false, installed: false }
    const config: ConfigReport = { mode: 'quite', checkDependencies: false, checkContent: false, root: 'project' }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toBeNull()
  })
})

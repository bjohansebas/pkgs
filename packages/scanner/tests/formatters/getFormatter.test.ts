import { getFormatters } from '@/index'
import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'production')

describe('getFormatters()', () => {
  describe('biome', () => {
    it('should return ["biome"] when biome is installed and formatter is true and checkDepedencies(true)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/root' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it("should return ['biome'] when biome isn't installed and formatter is enabled, checkDepedencies(false) and checkContent(true)", () => {
      const report = getFormatters({
        biome: { formatter: true, installed: false, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: false, checkContent: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it('should return ["biome"] when biome is installed and formatter is disabled, checkDepedencies(true) and checkContent(false)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true, checkContent: false },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it('should return null when biome is installed and formatter is disbled, checkDepedences(true) and checkContent(true)', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true, checkContent: true },
      })

      expect(report).toBeNull()
    })

    it('should return null when biome formatter is disabled and checkContent(true)', () => {
      const biome = { path: '/some/path', installed: false, formatter: false }
      const prettier = null
      const config = { root: '/root', checkContent: true, checkDepedencies: false }

      const result = getFormatters({ biome, prettier, config })

      expect(result).toBeNull()
    })

    it('should return null when biome path is null', () => {
      const biome = { installed: true, formatter: true }
      const prettier = null
      const config = { root: '/root', checkContent: false, checkDepedencies: true }

      const result = getFormatters({ biome, prettier, config })

      expect(result).toBeNull()
    })
  })

  describe('prettier', () => {
    it('should return ["prettier"] when prettier is installed and checkDepedencies(true)', () => {
      const report = getFormatters({
        biome: null,
        prettier: { installed: true },
        config: { root: '/projects/project', checkDepedencies: true },
      })

      expect(report).not.toContain('biome')
      expect(report).toContain('prettier')
    })

    it("should return ['prettier'] when prettier config is true, checkDepedencies(false)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { config: true, path: 'ls' },
        config: { root: '/projects/project', checkDepedencies: false },
      })

      expect(report).toContain('prettier')
      expect(report).not.toContain('biome')
    })

    it("should return null when prettier isn'n installed and config is not found, checkDepedencies(true)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { installed: false, config: false },
        config: { root: '/projects/project', checkDepedencies: true },
      })

      expect(report).toBeNull()
    })

    it("should return null when prettier isn'n installed and config is found, checkDepedences(true)", () => {
      const report = getFormatters({
        biome: null,
        prettier: { config: true, path: '/ls', installed: false },
        config: { root: '/projects/project', checkDepedencies: true },
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
    const config = { root: '/root', checkContent: false, checkDepedencies: false }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toBeNull()
  })

  it("should return ['biome', 'prettier'] when both biome and prettier conditions are met", () => {
    const biome = { path: '/some/path', installed: true, formatter: true }
    const prettier = { installed: true, config: false }
    const config = { root: '/some/path', checkContent: true, checkDepedencies: true }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toEqual(['biome', 'prettier'])
  })

  it('should return null when biome and prettier do not meet any conditions', () => {
    const biome = { installed: false, formatter: false }
    const prettier = { path: null, installed: false, config: false }
    const config = { root: '/some/path', checkContent: true, checkDepedencies: true }

    const result = getFormatters({ biome, prettier, config })

    expect(result).toBeNull()
  })
})

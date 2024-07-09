import { getFormatters } from '@/index'
import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'production')

describe('get formatters', () => {
  describe('biome', () => {
    it('should return biome when is installed and formatter is true and checkDepedences is true and checkContent is missing', () => {
      const report = getFormatters({
        biome: { formatter: true, installed: true, path: '/root' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it("should return biome when isn't installed and formatter is true and checkDepedencies is false and checkContent is true", () => {
      const report = getFormatters({
        biome: { formatter: true, installed: false, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: false, checkContent: true },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it('should return biome when is installed and formatter is true, checkDepedencies is true and checkContent false', () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true, checkContent: false },
      })

      expect(report).toContain('biome')
      expect(report).not.toContain('prettier')
    })

    it("shouldn't return biome when is installed, checkDepedences is true and checkContent true but formatter is false", () => {
      const report = getFormatters({
        biome: { formatter: false, installed: true, path: '/projects/project' },
        prettier: null,
        config: { root: '/projects/project', checkDepedencies: true, checkContent: true },
      })

      expect(report).toBeNull()
    })
  })
})

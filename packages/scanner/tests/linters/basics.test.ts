import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('linters in root package', () => {
  it("do not display any linter if there isn't any", async () => {
    const report = await generateReport(['src/index.ts', 'index.ts', 'index.test.ts'])

    expect(report.linters).toBe(null)
  })
})

describe('linters in packages', () => {
  it('linters in differents packages', async () => {
    const report = await generateReport([
      'package.json',
      'biome.json',
      'packages/ui/package.json',
      'packages/ui/eslint.config.js',
    ])

    expect(report.linters).toEqual(['biome'])
    expect(report.linters).toHaveLength(1)

    expect(report.packages).toHaveLength(1)
    if (!report.packages) {
      throw new Error('Packages is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.linters).toHaveLength(1)

      expect(packageReport.linters).toContain('eslint')
      expect(packageReport.linters).not.toContain('biome')
    }
  })

  it("do not display any linters if there isn't any", async () => {
    const report = await generateReport([
      'package.json',
      'index.js',
      'package/ui/cbiome.json',
      'package/ui/llbiome.jsonc',
      'package/ui/package.json',
      'package/ui/index.ts',
    ])

    expect(report.linters).toBe(null)

    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Packages is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.linters).toBe(null)
    }
  })
})

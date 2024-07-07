import { eslintFiles } from '@/constants'
import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('report eslint in root package', () => {
  it("do not report eslint when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport(['src/g.eslintrc.js', 'index.ts'])

    expect(report.linters).toBe(null)
  })

  it.each(eslintFiles)('report %s when it is in a subfolder', async (file) => {
    const report = await generateReport(['data.json', 'index.ts', `src/${file}`])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('eslint')
    expect(report.linters).not.toContain('biome')

    const report2 = await generateReport(['data.json', 'index.ts', `packages/config/${file}`])

    expect(report2.linters).toHaveLength(1)
    expect(report2.linters).toContain('eslint')
    expect(report2.linters).not.toContain('biome')
  })

  it.each(eslintFiles)('report eslint when using "%s"', async (file) => {
    const report = await generateReport(['data.json', 'index.ts', file])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('eslint')
    expect(report.linters).not.toContain('biome')
  })
})

describe('report eslint in packages', () => {
  it("do not report eslint when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport([
      'package.json',
      'index.js',
      'package/ui/g.eslintrc.js',
      'package/ui/package.json',
      'package/ui/index.ts',
    ])

    expect(report.linters).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.linters).toBe(null)
    }
  })

  it.each(eslintFiles)('report eslint when using "%s"', async (file) => {
    const report = await generateReport(['package.json', 'package/cli/package.json', 'index.ts', `package/cli/${file}`])

    expect(report.linters).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.linters).toHaveLength(1)
      expect(packageReport.linters).toContain('eslint')
      expect(packageReport.linters).not.toContain('biome')
    }
  })
})

import { prettierFiles } from '@/constants'
import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('report prettier in root package with default config', () => {
  it("do not report prettier when it's in a subfolder and the file is improperly named", async () => {
    const report = await generateReport(['src/g.prettierrc', 'index.ts'])

    expect(report.formatter).toBe(null)
  })

  it.each(prettierFiles)('report %s when it is in a subfolder', async (file) => {
    const report = await generateReport(['data.json', 'index.ts', `src/${file}`])

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('prettier')
    expect(report.formatter).not.toContain('biome')

    const report2 = await generateReport(['data.json', 'index.ts', `packages/config/${file}`])

    expect(report2.formatter).toHaveLength(1)
    expect(report2.formatter).toContain('prettier')
    expect(report2.formatter).not.toContain('biome')
  })

  it.each(prettierFiles)('report prettier when using "%s"', async (file) => {
    const report = await generateReport(['data.ts', 'data.json', 'index.ts', file])

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('prettier')
    expect(report.formatter).not.toContain('biome')
  })
})

describe('report prettier in packages with default config', () => {
  it("do not report prettier when it's in a package and the file is improperly named", async () => {
    const report = await generateReport([
      'package.json',
      'index.js',
      'package/ui/g.prettierrc',
      'package/ui/package.json',
      'package/ui/index.ts',
    ])
    expect(report.formatter).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.formatter).toBe(null)
    }
  })

  it.each(prettierFiles)('report %s when it is in a package', async (file) => {
    const report = await generateReport(['package.json', 'index.ts', 'package/cli/package.json', `package/cli/${file}`])

    expect(report.formatter).toBe(null)
    expect(report.packages).toHaveLength(1)

    if (!report.packages) {
      throw new Error('Package is empty')
    }

    for (const packageReport of report.packages) {
      expect(packageReport.formatter).toHaveLength(1)
      expect(packageReport.formatter).toContain('prettier')
      expect(packageReport.formatter).not.toContain('biome')
    }
  })
})

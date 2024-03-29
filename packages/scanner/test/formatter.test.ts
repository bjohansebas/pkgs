import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'
import { biomeFiles, prettierFiles } from '../src/constants'

describe('report formatters', () => {
  it("do not display any formatter if there isn't any", () => {
    const report = generateReport({ files: ['src/index.ts', 'index.ts', 'package.json', 'index.test.ts'] })

    expect(report.formatter).toBe(null)
  })
  it.each(biomeFiles)("report biome when using '%s'", (file) => {
    const report = generateReport({ files: [file, 'package.json'] })

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('biome')
    expect(report.formatter).not.toContain('prettier')
  })

  it.each(biomeFiles)('report %s when it is in a subfolder', (file) => {
    const report = generateReport({ files: [`src/${file}`, 'index.ts'] })

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('biome')
    expect(report.formatter).not.toContain('prettier')

    const report2 = generateReport({ files: [`packages/config/${file}`, 'index.ts'] })
    expect(report2.formatter).toHaveLength(1)
    expect(report2.formatter).toContain('biome')
    expect(report2.formatter).not.toContain('prettier')
  })

  it("do not report biome when it's in a subfolder and the file is improperly named", () => {
    const report = generateReport({ files: ['src/lbiome.json', 'index.ts'] })

    expect(report.formatter).toBe(null)
  })

  it("do not report prettier when it's in a subfolder and the file is improperly named", () => {
    const report = generateReport({ files: ['src/g.prettierrc', 'index.ts'] })

    expect(report.formatter).toBe(null)
  })

  it.each(prettierFiles)('report %s when it is in a subfolder', (file) => {
    const report = generateReport({ files: ['package.json', 'index.ts', `src/${file}`] })

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('prettier')
    expect(report.formatter).not.toContain('biome')

    const report2 = generateReport({ files: ['package.json', 'index.ts', `packages/config/${file}`] })

    expect(report2.formatter).toHaveLength(1)
    expect(report2.formatter).toContain('prettier')
    expect(report2.formatter).not.toContain('biome')
  })

  it.each(prettierFiles)('report prettier when using "%s"', (file) => {
    const report = generateReport({ files: ['package.json', 'index.ts', file] })

    expect(report.formatter).toHaveLength(1)
    expect(report.formatter).toContain('prettier')
    expect(report.formatter).not.toContain('biome')
  })
})

import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'
import { biomeFiles, eslintFiles } from '../src/constants'

describe('report linters', () => {
  it("do not display any linter if there isn't any", () => {
    const report = generateReport(['src/index.ts', 'index.ts', 'package.json', 'index.test.ts'])

    expect(report.linters).toBe(null)
  })
  it.each(biomeFiles)("report biome when using '%s'", (file) => {
    const report = generateReport([file, 'package.json'])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')
  })

  it.each(biomeFiles)('report %s when it is in a subfolder', (file) => {
    const report = generateReport([`src/${file}`, 'index.ts'])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
    expect(report.linters).not.toContain('eslint')

    const report2 = generateReport([`packages/config/${file}`, 'index.ts'])

    expect(report2.linters).toHaveLength(1)
    expect(report2.linters).toContain('biome')
    expect(report2.linters).not.toContain('eslint')
  })

  it("do not report biome when it's in a subfolder and the file is improperly named", () => {
    const report = generateReport(['src/lbiome.json', 'index.ts'])

    expect(report.linters).toBe(null)
  })

  it("do not report eslint when it's in a subfolder and the file is improperly named", () => {
    const report = generateReport(['src/g.eslintrc.js', 'index.ts'])

    expect(report.linters).toBe(null)
  })

  it.each(eslintFiles)('report %s when it is in a subfolder', (file) => {
    const report = generateReport(['package.json', 'index.ts', `src/${file}`])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('eslint')
    expect(report.linters).not.toContain('biome')

    const report2 = generateReport(['package.json', 'index.ts', `packages/config/${file}`])

    expect(report2.linters).toHaveLength(1)
    expect(report2.linters).toContain('eslint')
    expect(report2.linters).not.toContain('biome')
  })

  it.each(eslintFiles)('report eslint when using "%s"', (file) => {
    const report = generateReport(['package.json', 'index.ts', file])

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('eslint')
    expect(report.linters).not.toContain('biome')
  })
})

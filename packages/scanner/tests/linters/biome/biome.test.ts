import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { generateReport, scanFolder } from '../../../src'
import { biomeFiles } from '../../../src/constants'

describe('report biome when exists file', () => {
  it.each(biomeFiles)("report biome when using '%s'", (file) => {
    const report = generateReport([file, 'data.json'])

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
})

describe('read the file', () => {
  it('do not report biome when linter is desactived', async () => {
    const resolvedProjectPath = path.resolve('./biome_not_linter')

    const files = await scanFolder(resolvedProjectPath)

    const report = generateReport(files)

    expect(report.linters).toBe(null)
  })

  it("do not report biome when biome isn't dependencie", async () => {
    const resolvedProjectPath = path.resolve('./biome_not_installed')

    const files = await scanFolder(resolvedProjectPath)

    const report = generateReport(files)

    expect(report.linters).toBe(null)
  })

  it('good config', async () => {
    const resolvedProjectPath = path.resolve('./correct_config')

    const files = await scanFolder(resolvedProjectPath)

    const report = generateReport(files)

    expect(report.linters).toHaveLength(1)
    expect(report.linters).toContain('biome')
  })
})

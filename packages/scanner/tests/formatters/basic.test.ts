import { generateReport } from '@/index'
import { describe, expect, it } from 'vitest'

describe('formatters in packages', () => {
  it('formatters in differents packages', async () => {
    const report = await generateReport(
      ['package.json', 'biome.json', 'packages/ui/package.json', 'packages/ui/.prettierrc'],
      { checkDepedencies: false, root: process.cwd() },
    )

    expect(report.packages).toHaveLength(1)

    expect(report.formatter).toEqual(['biome'])
    expect(report.formatter).toHaveLength(1)
  })
})

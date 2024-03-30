import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'

describe('report languages of projects', () => {
  it('do not report TypeScript or JavaScript if there are no files with their extensions', () => {
    const report = generateReport(['data.json', 'package.json'])

    expect(report.languages).toBe(null)
  })

  it('report only TypeScript when there are only TypeScript files', () => {
    const report = generateReport(['index.ts', 'test.ts', 'types.ts'])

    expect(report.languages).toContain('typescript')
    expect(report.languages).not.toContain('javascript')
  })

  it('report only JavaScript when there are only JavaScript files', () => {
    const report = generateReport(['data.json', 'package.json', 'src/index.js', 'bin.mjs'])

    expect(report.languages).not.toBe(null)

    expect(report.languages).toContain('javascript')
    expect(report.languages).not.toContain('typescript')
  })

  it.each(['js', 'cjs', 'mjs', 'jsx'])('report javascript if there is a "%s" file', (extension) => {
    const reportWithSubfolders = generateReport(['data.json', 'package.json', `src/index.${extension}`])

    expect(reportWithSubfolders.languages).not.toBe(null)

    expect(reportWithSubfolders.languages).toContain('javascript')
    expect(reportWithSubfolders.languages).not.toContain('typescript')

    const report = generateReport(['data.json', 'package.json', `index.${extension}`])

    expect(report.languages).not.toBe(null)

    expect(report.languages).toContain('javascript')
    expect(report.languages).not.toContain('typescript')
  })

  it.each(['ts', 'mts', 'tsx', 'd.ts', 'd.mts'])('report typescript if there is a "%s" file', (extension) => {
    const reportWithSubfolders = generateReport(['data.json', 'package.json', `src/index.${extension}`])

    expect(reportWithSubfolders.languages).not.toBe(null)

    expect(reportWithSubfolders.languages).not.toContain('javascript')
    expect(reportWithSubfolders.languages).toContain('typescript')

    const report = generateReport(['data.json', 'package.json', `index.${extension}`])

    expect(report.languages).not.toBe(null)

    expect(report.languages).not.toContain('javascript')
    expect(report.languages).toContain('typescript')
  })

  it('report TypeScript if the tsconfig file exists', () => {
    const report = generateReport(['data.js', 'package.json', 'tsconfig.json'])

    expect(report.languages).toContain('typescript')
  })
})

import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'

describe('report languages of projects', () => {
  it('do not report TypeScript or JavaScript if there are no files with their extensions', () => {
    const report = generateReport({ files: ['data.json', 'package.json'] })

    expect(report.languages).toBe(null)
  })

  it('report only TypeScript when there are only TypeScript files', () => {
    const report = generateReport({ files: ['index.ts', 'test.ts', 'types.ts'] })

    expect(report.languages?.javascript).toBe(false)
    expect(report.languages?.typescript).toBe(true)
  })

  it('report only JavaScript when there are only JavaScript files', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'src/index.js'] })

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(true)
    expect(report.languages?.typescript).toBe(false)
  })

  it('report TypeScript if the tsconfig file exists', () => {
    const report = generateReport({ files: ['data.js', 'package.json', 'tsconfig.json'] })

    expect(report.languages?.typescript).toBe(true)
  })

  it('report TypeScript if there are DTS(.d.ts) files.', () => {
    const report = generateReport({ files: ['data.d.ts', 'package.json', 'dist', 'index.js'] })

    expect(report.languages?.typescript).toBe(true)
  })
})

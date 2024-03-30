import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'

describe('report languages of projects', () => {
  it('do not report TypeScript or JavaScript if there are no files with their extensions', () => {
    const report = generateReport(['data.json', 'package.json'])

    expect(report.languages).toBe(null)
  })

  it('report only TypeScript when there are only TypeScript files', () => {
    const report = generateReport(['index.ts', 'test.ts', 'types.ts'])

    expect(report.languages?.javascript).toBe(false)
    expect(report.languages?.typescript).toBe(true)
  })

  it('report only JavaScript when there are only JavaScript files', () => {
    const report = generateReport(['data.json', 'package.json', 'src/index.js', 'bin.mjs'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(true)
    expect(report.languages?.typescript).toBe(false)
  })

  it('report JavaScript if there is a ".mjs" file', () => {
    const report = generateReport(['data.json', 'package.json', 'cli.mjs', 'src/index.mjs'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(true)
    expect(report.languages?.typescript).toBe(false)
  })

  it('report JavaScript if there is a ".cjs" file', () => {
    const report = generateReport(['data.json', 'package.json', 'cli.cjs', 'src/index.cjs'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(true)
    expect(report.languages?.typescript).toBe(false)
  })

  it('report JavaScript if there is a ".jsx" file', () => {
    const report = generateReport(['data.json', 'package.json', 'src/cli.jsx', 'src/index.jsx'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(true)
    expect(report.languages?.typescript).toBe(false)
  })

  it('report TypeScript if there is a ".tsx" file', () => {
    const report = generateReport(['data.json', 'package.json', 'src/cli.tsx', 'src/index.tsx'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(false)
    expect(report.languages?.typescript).toBe(true)
  })

  it('report Typescript if there is a ".d.mts" file', () => {
    const report = generateReport(['data.json', 'package.json', 'cli.d.mts', 'index.d.mts'])

    expect(report.languages).not.toBe(null)

    expect(report.languages?.javascript).toBe(false)
    expect(report.languages?.typescript).toBe(true)
  })

  it('report TypeScript if the tsconfig file exists', () => {
    const report = generateReport(['data.js', 'package.json', 'tsconfig.json'])

    expect(report.languages?.typescript).toBe(true)
  })

  it('report TypeScript if there are DTS(.d.ts) files.', () => {
    const report = generateReport(['data.d.ts', 'package.json', 'dist', 'index.js'])

    expect(report.languages?.typescript).toBe(true)
  })
})

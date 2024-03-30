import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'

describe('report package managers', () => {
  it('report only pnpm', () => {
    const report = generateReport(['data.json', 'data.ts', 'pnpm-lock.yaml'])

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('pnpm')

    expect(report.package_manager).not.toContain('npm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('yarn')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only npm', () => {
    const report = generateReport(['data.json', 'data.ts', 'package-lock.json'])

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('npm')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('yarn')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only yarn', () => {
    const report = generateReport(['data.json', 'data.ts', 'yarn.lock'])

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('yarn')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only bun', () => {
    const report = generateReport(['data.json', 'data.ts', 'bun.lockb'])

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('bun')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only deno', () => {
    const report = generateReport(['data.json', 'data.ts', 'deno.lock'])

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('deno')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('do not report any package manager', () => {
    const report = generateReport(['data.json', 'data.ts'])

    expect(report.package_manager).toBe(null)
  })

  it('report if there are multiple package managers', () => {
    const report = generateReport(['data.json', 'data.ts', 'pnpm-lock.yaml', 'bun.lockb', 'package-lock.json'])

    expect(report.package_manager).toContain('pnpm')
    expect(report.package_manager).toContain('bun')
    expect(report.package_manager).toContain('npm')

    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toBe(null)
  })
})

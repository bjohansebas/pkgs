import { describe, expect, it } from 'vitest'
import { generateReport } from '../src'

describe('report package managers', () => {
  it('report only pnpm', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'pnpm-lock.yaml'] })

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('pnpm')

    expect(report.package_manager).not.toContain('npm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('yarn')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only npm', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'package-lock.json'] })

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('npm')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('yarn')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only yarn', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'yarn.lock'] })

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('yarn')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only bun', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'bun.lockb'] })

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('bun')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('report only deno', () => {
    const report = generateReport({ files: ['data.json', 'package.json', 'deno.lock'] })

    expect(report.package_manager).toHaveLength(1)
    expect(report.package_manager).toContain('deno')

    expect(report.package_manager).not.toContain('pnpm')
    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('bun')
    expect(report.package_manager).not.toContain('npm')

    expect(report.package_manager).not.toBe(null)
  })

  it('do not report any package manager', () => {
    const report = generateReport({ files: ['data.json', 'package.json'] })

    expect(report.package_manager).toBe(null)
  })

  it('report if there are multiple package managers', () => {
    const report = generateReport({
      files: ['data.json', 'package.json', 'pnpm-lock.yaml', 'bun.lockb', 'package-lock.json'],
    })

    expect(report.package_manager).toContain('pnpm')
    expect(report.package_manager).toContain('bun')
    expect(report.package_manager).toContain('npm')

    expect(report.package_manager).not.toContain('yarn')
    expect(report.package_manager).not.toContain('deno')
    expect(report.package_manager).not.toBe(null)
  })
})

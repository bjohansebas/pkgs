import { checkDependencies } from '@/helpers/check-dependencie'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('checkDependencies()', () => {
  beforeEach(() => {
    vi.resetModules()

    vi.stubEnv('NODE_ENV', 'test')
  })
  it('should return true when checkDependencies is true and dependecie is found in packageJson', () => {
    const packageJson = { path: '', dependencies: { 'some-dependecie': '1.0.0' } }
    const result = checkDependencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(true)
  })

  it('should return false when checkDependencies is undefined and NODE_ENV is not "test"', () => {
    vi.stubEnv('NODE_ENV', 'production')

    const result = checkDependencies(undefined, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return false when checkDependencies is false regardless of packageJson content', () => {
    const result = checkDependencies(false, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return false when checkDependencies is true and packageJson is null or undefined', () => {
    const result = checkDependencies(true, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return true when checkDependencies is undefined and NODE_ENV is test', () => {
    vi.stubEnv('NODE_ENV', 'test')

    const result = checkDependencies(undefined, null, 'some-dependecie')

    expect(result).toBe(true)
  })

  it('should return false when checkDependencies is true and packageJson is an empty object', () => {
    const packageJson = { path: '' }
    const result = checkDependencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(false)
  })

  it('should return false when checkDependencies is true and dependecie is not found in packageJson', () => {
    const packageJson = { path: '', dependencies: { 'some-other-dependecie': '1.0.0' } }

    const result = checkDependencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(false)
  })

  it('should return false when checkDependencies is true and dependecie is found in nested dependencies of packageJson', () => {
    const packageJson = {
      path: 'd',
      dependencies: {
        'some-dependecie': '1.0.0',
        'nested-dependencies': {
          'nested-dependecie': '2.0.0',
        },
      },
    }

    // @ts-expect-error
    const result = checkDependencies(true, packageJson, 'nested-dependencie')
    expect(result).toBe(false)
  })
})

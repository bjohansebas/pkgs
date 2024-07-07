import { checkDepedencies } from '@/helpers/check-dependencie'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('checkDependencies()', () => {
  beforeEach(() => {
    vi.resetModules()

    vi.stubEnv('NODE_ENV', 'test')
  })
  it('should return true when checkDepedencies is true and dependecie is found in packageJson', () => {
    const packageJson = { path: '', dependencies: { 'some-dependecie': '1.0.0' } }
    const result = checkDepedencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(true)
  })

  it('should return false when checkDepedencies is undefined and NODE_ENV is not "test"', () => {
    vi.stubEnv('NODE_ENV', 'production')

    const result = checkDepedencies(undefined, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return false when checkDepedencies is false regardless of packageJson content', () => {
    const result = checkDepedencies(false, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return false when checkDepedencies is true and packageJson is null or undefined', () => {
    const result = checkDepedencies(true, null, 'some-dependecie')

    expect(result).toBe(false)
  })

  it('should return true when checkDepedencies is undefined and NODE_ENV is test', () => {
    vi.stubEnv('NODE_ENV', 'test')

    const result = checkDepedencies(undefined, null, 'some-dependecie')

    expect(result).toBe(true)
  })

  it('should return false when checkDepedencies is true and packageJson is an empty object', () => {
    const packageJson = { path: '' }
    const result = checkDepedencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(false)
  })

  it('should return false when checkDepedencies is true and dependecie is not found in packageJson', () => {
    const packageJson = { path: '', dependencies: { 'some-other-dependecie': '1.0.0' } }

    const result = checkDepedencies(true, packageJson, 'some-dependecie')
    expect(result).toBe(false)
  })

  it('should return false when checkDepedencies is true and dependecie is found in nested dependencies of packageJson', () => {
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
    const result = checkDepedencies(true, packageJson, 'nested-dependencie')
    expect(result).toBe(false)
  })
})

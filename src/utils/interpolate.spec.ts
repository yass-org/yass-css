import { DesignToken } from '../types'
import { interpolate } from './interpolate'

describe('interpolate', () => {
  it('does not interpolated when no variable is defined', () => {
    const result = interpolate('hello {} world', [])
    expect(result).toBe('hello {} world')
  })

  it('does not interpolate when curly braces are escaped', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
    ]
    const result = interpolate('hello \\{blue-100\\} world', tokens)
    expect(result).toBe('hello \\{blue-100\\} world')
  })

  it('interpolates multiple variables', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
      { key: 'green-100', value: '#00FF00' },
      { key: 'red-100', value: '#FF0000' },
    ]

    const result = interpolate('hello {blue-100} huh {green-100}world {red-100}', tokens)
    expect(result).toBe('hello #0000FF huh #00FF00world #FF0000')
  })

  it('ignores escaped curly braces and interpolates actual variables', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
      { key: 'green-100', value: '#00FF00' },
      { key: 'red-100', value: '#FF0000' },
    ]

    const result = interpolate('hello \\{blue-100\\} huh {green-100}world {red-100}', tokens)
    expect(result).toBe('hello \\{blue-100\\} huh #00FF00world #FF0000')
  })

  it('does not mutate empty string', () => {
    const result = interpolate('', [])
    expect(result).toBe('')
  })

  it('interpolates simple string', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
    ]
    const result = interpolate('{blue-100}', tokens)
    expect(result).toBe('#0000FF')
  })

  it('interpolates the same variable multiple times', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
    ]
    const result = interpolate('{blue-100}{blue-100}', tokens)
    expect(result).toBe('#0000FF#0000FF')
  })

  it('throws an error when valid variable is not in scope', () => {
    const tokens: DesignToken[] = [
      { key: 'blue-100', value: '#0000FF' },
    ]

    expect(() => interpolate('{green-100}', tokens)).toThrow(new Error('token "{green-100}" not in scope.'))
  })
})

import { build, validateToken } from './build'
import { getConfig } from './config'
import type { Category, DesignToken } from './types'
import type { Config, UserConfig } from './config'


describe('build()', () => {
  it('generates classname from token.key if token.name is not present', () => {
    const tokens: DesignToken[] = [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      {
        key: 'color-green',
        value: 'rgb(0, 255, 0)',
        properties: ['color'],
      }      
    ]

    const config: Config = getConfig({})

    const stylesheet = build(tokens, config)
    expect(stylesheet).toContain('--color-red: rgb(255, 0, 0);')
    expect(stylesheet).toContain('--color-green: rgb(0, 255, 0);')
  })

  it('prefers token.name over token.key to generate classname if token.name is present', () => {
    const tokens: DesignToken[] = [{
      key: 'color-red',
      value: 'rgb(255, 0, 0)',
      name: 'red',
      properties: ['color'],
    }]

    const config: Config = getConfig({})
    const stylesheet = build(tokens, config)

    expect(stylesheet).toContain('--color-red: rgb(255, 0, 0);') // Uses token.key for the custom property
    expect(stylesheet).toContain('.color\\:red { color: var(--color-red); }') // Uses token.name for the classname
  })

  it('does not generate :root element if no tokens are defined', () => {
    const tokens: DesignToken[] = []

    const config: Config = getConfig({})
    const stylesheet = build(tokens, config)

    expect(stylesheet).toBe('')
  })

  it('matches snapshot', () => {
    const tokens: DesignToken[] = [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      {
        key: 'color-green',
        value: 'rgb(0, 255, 0)',
        name: 'green',
        properties: ['color'],
      },
      {
        key: 'block',
        value: 'block',
        properties: ['display'],
      },
      {
        key: 'color-blue',
        value: 'rgb(0, 0, 200)',
        themes: {
          'high-contrast': 'rgb(0, 0, 255)',
          'dark': 'rgb(0, 0, 100)'
        },
        name: 'green',
        properties: ['color'],
      },      
    ]

    const config: Config = getConfig({
      token: {
        namespace: 'yass-',
        separator: '-'
      }
    })
    const stylesheet = build(tokens, config)

    expect(stylesheet).toMatchSnapshot()
  })
})

describe('validateToken()', () => {
  it.each([
    [
      {
        key: undefined,
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a key' },
    ],
    [
      {
        key: '',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a key' },
    ],
    [
      {
        key: 'color-red',
        value: '',
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a value' },
    ],
    [
      {
        key: 'color-red',
        value: undefined,
        properties: ['color'],
      },
      { isValid: false, reason: 'A token must define a value' },
    ],
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
      },
      { isValid: false, reason: 'A token must define either a category, or a list of properties' },
    ],
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        category: 'color' as Category,
      },
      { isValid: true },
    ],    
    [
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      { isValid: true },
    ],
  ])('should return %p for %p and %s', (token, expected) => {
    expect(validateToken(token)).toEqual(expected);
  })

})

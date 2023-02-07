import { build } from './build'
import { getConfig } from './config'
import type { DesignToken } from './types'
import type { Config } from './config'


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
        key: 'color-red-light',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
      },
      {
        key: 'color-red',
        value: 'rgb(255, 0, 0)',
        properties: ['color'],
        themes: {
          'light': '{color-red-light}'
        }
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
          'dark': 'rgb(0, 0, 100)',
          'light': '{color-blue}'
        },
        name: 'blue',
        properties: ['color'],
      },      
    ]

    const config: Config = getConfig({
      rules: {
        namespace: 'yass-',
        separator: '-'
      }
    })
    const stylesheet = build(tokens, config)

    expect(stylesheet).toMatchSnapshot()
  })
})

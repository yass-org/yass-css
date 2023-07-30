import { Config, getConfig } from './config'


describe('getConfig()', () => {
  it('generates a default config', () => {
    const config = getConfig({ src: '.' })

    expect(config).toEqual({
      src: expect.any(Array<string>),
      rules: {
        namespace: '',
        separator: ':',
      },
      stylesheet: {
        buildPath:  'styles/yass/',
        filename: 'yass.css',
      },
    })
  })

  it('accepts overrides', () => {
    const config: Config = getConfig({
      src: './src',
      rules: {
        namespace: 'ds-',
        separator: '-',
      },
      stylesheet: {
        buildPath:  'styles/',
        filename: 'styles.css',
      },
    })

    expect(config).toEqual({
      src: expect.any(Array<string>),
      rules: {
        namespace: 'ds-',
        separator: '-',
      },
      stylesheet: {
        buildPath:  'styles/',
        filename: 'styles.css',
      },
    })
  })

  it('accepts partial override', () => {
    const config = getConfig({
      src: './src',
      stylesheet: {
        filename: 'styles.css'
      }
    })

    expect(config).toEqual({
      src: expect.any(Array<string>),
      rules: {
        namespace: '',
        separator: ':',
      },
      stylesheet: {
        buildPath:  'styles/yass/',
        filename: 'styles.css',
      },
    })
  })
})

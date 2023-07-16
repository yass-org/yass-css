import { Config, getConfig } from './config'


describe('getConfig()', () => {
  it('generates a default config', () => {
    const config = getConfig({})

    expect(config).toEqual({
      rules: {
        namespace: '',
        separator: ':',
      },
      stylesheet: {
        buildPath:  'styles/yass/',
        filename: 'yass.css',
        include: {
          baseClasses: true,
          tokenClasses: true,
          pseudos: true,
        }
      },
    })
  })

  it('accepts overrides', () => {
    const config: Config = getConfig({
      rules: {
        namespace: 'ds-',
        separator: '-',
      },
      stylesheet: {
        buildPath:  'styles/',
        filename: 'styles.css',
        include: {
          baseClasses: false,
          tokenClasses: false,
          pseudos: true,
        }
      },
    })

    expect(config).toEqual({
      rules: {
        namespace: 'ds-',
        separator: '-',
      },
      stylesheet: {
        buildPath:  'styles/',
        filename: 'styles.css',
        include: {
          baseClasses: false,
          tokenClasses: false,
          pseudos: true,
        }
      },
    })
  })

  it('accepts partial override', () => {
    const config = getConfig({
      stylesheet: {
        include: {
          baseClasses: false,
        }
      },
    })

    expect(config).toEqual({
      rules: {
        namespace: '',
        separator: ':',
      },
      stylesheet: {
        buildPath:  'styles/yass/',
        filename: 'yass.css',
        include: {
          baseClasses: false,
          tokenClasses: true,
          pseudos: true,
        }
      },
    })
  })
})

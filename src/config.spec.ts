import { getConfig } from './config'


describe('getConfig()', () => {
  it('generates a default config', () => {
    const config = getConfig({})

    expect(config).toEqual({
      src: undefined,
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
      types: {
        buildPath: 'types/',
        filename: 'yass.ts',
      },
    })
  })

  it('accepts overrides', () => {
    const config = getConfig({
      src: './sircDir',
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
      types: {
        buildPath: 'types/yass/',
        filename: 'types.ts',
      },
    })

    expect(config).toEqual({
      src: './sircDir',
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
      types: {
        buildPath: 'types/yass/',
        filename: 'types.ts',
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
      src: undefined,
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
      types: {
        buildPath: 'types/',
        filename: 'yass.ts',
      },
    })
  })
})

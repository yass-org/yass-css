import { defaultConfig, type Config } from '../config'
import type { DesignToken } from '../types'
import { JitCompiler } from '.'

describe('JitCompiler', () => {
  describe('basic functionality', () => {
    it('generates classes referenced in source code', () => {
      const tokens: DesignToken[] = [
        { key: 'blue-100', value: '#0000F1', properties: ['background-color'] }, // token that specifies a property
        { key: 'blue-101', value: '#0000F2', category: 'color' }, // token that specifies a category
        { key: 'blue-102', value: '{blue-100}', properties: ['background-color'] }, // alias token that references another token
      ]

      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:block"></div>', // base CSS class
          '<div class="background-color:blue-100"></div>', // tokenised class
          '<div class="background-color:blue-102"></div>', // tokenised class that references an alias
        ]
      }


      const css = JitCompiler.compile({ tokens, config })

      expect(css).toContain('--blue-100: #0000F1')
      expect(css).toContain('--blue-101: #0000F2')
      expect(css).toContain('--blue-102: var(--blue-100)')

      expect(css).toContain('.display\\:block { display: block; }')
      expect(css).toContain('.background-color\\:blue-100 { background-color: var(--blue-100); }')
      expect(css).toContain('.background-color\\:blue-102 { background-color: var(--blue-102); }')
    })
  })

  describe('pseudo-classes', () => {
    it('generates pseudo classes', () => {
      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:flex:hover"></div>', // accepts pseudos
          '<div class="display:inline:hover:active"></div>', // accepts chained pseudos
          '<div class="display:inline-block:nth-child(2n+1)"></div>', // accepts pseudo functions with arbitrary arguments
          // generates both base, and pseudo variants of a class if specified
          '<div class="display:revert"></div>',
          '<div class="display:revert:active"></div>',
        ]
      }

      const css = JitCompiler.compile({ tokens: [], config })

      expect(css).toContain('.display\\:flex\\:hover:hover { display: flex; }')
      expect(css).toContain('.display\\:inline\\:hover\\:active:hover:active { display: inline; }')
      expect(css).toContain('.display\\:inline-block\\:nth-child\\(2n\\+1\\):nth-child(2n+1) { display: inline-block; }')
      expect(css).toContain('.display\\:revert { display: revert; }')
      expect(css).toContain('.display\\:revert\\:active:active { display: revert; }')
    })

    it('does not accept pseudos that contain a space', () => {
      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:inline-block:nth-child(2n + 1)"></div>', // since "(2n + 1)" contains spaces, it should not work
        ]
      }

      const css = JitCompiler.compile({ tokens: [], config })

      expect(css).not.toContain('.display\\:inline-block\\:nth-child\\(2n\\+1\\):nth-child(2n+1) { display: inline-block; }')

      // it should also not generate a partial class
      expect(css).not.toContain('.display\\:inline-block\\:nth-child\\(2n:nth-child(2n { display: inline-block; }')
    })

    it('does not accept invalid pseudos', () => {
      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:block:hoover"></div>', // since "hoover" is not a valid pseudo, it should not work
        ]
      }

      const css = JitCompiler.compile({ tokens: [], config })

      expect(css).not.toContain('.display\\:block\\:hoover { display: block; }')
      expect(css).not.toContain('.display\\:block { display: block; }')
    })
  })

  describe('media queries', () => {
    it('generates media queries', () => {
      const tokens: DesignToken[] = [
        { key: 'sm', value: 'min-width: 460px', category: 'media' },
        { key: 'md', value: 'min-width: 768px', category: 'media' },
      ]

      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:flex@media({md})"></div>', // accepts media query
          // '<div class="display:inline:hover@media({md})"></div>', // accepts chained pseudos and MQs
          // '<div class="display:@media({md}):nth-child(2n+1)"></div>', // accepts MQs and functional pseudos
          // '<div class="display:block@media({sm})@media({md})"></div>', // accepts multiple MQs
          // // generates both base, and pseudo variants of a class if specified
          // '<div class="display:revert"></div>',
          // '<div class="display:revert:@media({md})"></div>',
        ]
      }

      const css = JitCompiler.compile({ tokens, config })

      expect(css).toMatchSnapshot()
    })

    // it('does not accept pseudos that contain a space', () => {
    //   const config: Config = {
    //     ...defaultConfig,
    //     src: [
    //       '<div class="display:inline-block:nth-child(2n + 1)"></div>', // since "(2n + 1)" contains spaces, it should not work
    //     ]
    //   }

    //   const css = JitCompiler.compile({ tokens: [], config })

    //   expect(css).not.toContain('.display\\:inline-block\\:nth-child\\(2n\\+1\\):nth-child(2n+1) { display: inline-block; }')

    //   // it should also not generate a partial class
    //   expect(css).not.toContain('.display\\:inline-block\\:nth-child\\(2n:nth-child(2n { display: inline-block; }')
    // })

    // it('does not accept invalid pseudos', () => {
    //   const config: Config = {
    //     ...defaultConfig,
    //     src: [
    //       '<div class="display:block:hoover"></div>', // since "hoover" is not a valid pseudo, it should not work
    //     ]
    //   }

    //   const css = JitCompiler.compile({ tokens: [], config })

    //   expect(css).not.toContain('.display\\:block\\:hoover { display: block; }')
    //   expect(css).not.toContain('.display\\:block { display: block; }')
    // })
  })

  describe('config options', () => {
    it('applies namespace', () => {
      const tokens: DesignToken[] = [
        { key: 'space-100', value: '8px', properties: ['padding'] }
      ]
      const config: Config = {
        ...defaultConfig,
        rules: {
          namespace: 'yass-',
          separator: ':' // TODO: Should not have to specify the other `rules` attrs.
        },
        src: [
          '<div class="yass-display:block"></div>', // generates a base class
          '<div class="yass-display:flex:active"></div>', // generates pseudos
          '<div class="yass-display:flex:active:focus"></div>', // generates chained pseudos
          '<div class="yass-padding:space-100"></div>', // generates tokenised class
          '<div class="yass-padding:space-100:focus"></div>', // generates tokenised class with pseudos
          '<div class="yass-padding:space-100:focus:active"></div>', // generates tokenised class with chained pseudos
        ]
      }
      const css = JitCompiler.compile({ tokens, config })

      expect(css).toContain('.yass-display\\:block { display: block; }')
      expect(css).toContain('.yass-display\\:flex\\:active:active { display: flex; }')
      expect(css).toContain('.yass-display\\:flex\\:active\\:focus:active:focus { display: flex; }')
      expect(css).toContain('.yass-padding\\:space-100 { padding: var(--yass-space-100); }')
      expect(css).toContain('.yass-padding\\:space-100\\:focus:focus { padding: var(--yass-space-100); }')
      expect(css).toContain('.yass-padding\\:space-100\\:focus\\:active:focus:active { padding: var(--yass-space-100); }')
    })

    it('applies separator', () => {
      const tokens: DesignToken[] = [
        { key: 'space-100', value: '8px', properties: ['padding'] }
      ]
      const config: Config = {
        ...defaultConfig,
        rules: {
          namespace: '',
          separator: '-'
        },
        src: [
          '<div class="display-block"></div>', // generates a base class
          '<div class="display-flex:active"></div>', // generates pseudos
          '<div class="display-flex:active:focus"></div>', // generates chained pseudos
          '<div class="padding-space-100"></div>', // generates tokenised class
          '<div class="padding-space-100:focus"></div>', // generates tokenised class with pseudos
          '<div class="padding-space-100:focus:active"></div>', // generates tokenised class with chained pseudos
        ]
      }

      const css = JitCompiler.compile({ tokens, config })

      expect(css).toContain('.display-block { display: block; }')
      expect(css).toContain('.display-flex\\:active:active { display: flex; }')
      expect(css).toContain('.display-flex\\:active\\:focus:active:focus { display: flex; }')
      expect(css).toContain('.padding-space-100 { padding: var(--space-100); }')
      expect(css).toContain('.padding-space-100\\:focus:focus { padding: var(--space-100); }')
      expect(css).toContain('.padding-space-100\\:focus\\:active:focus:active { padding: var(--space-100); }')
    })

    it('handles source code', () => {
      const tokens: DesignToken[] = [
        { key: 'blue-100', value: '#0000F1', properties: ['background-color'] }, // token that specifies a property
        { key: 'blue-101', value: '#0000F2', category: 'color' }, // token that specifies a category
        { key: 'blue-102', value: '{blue-100}', properties: ['background-color'] }, // alias token that references another token
        { key: 'space-100', value: '8px', properties: ['gap'] },
        { key: 'space-200', value: '16px', properties: ['gap'] },
      ]

      const config: Config = {
        ...defaultConfig,
        src: [
          '<div class="display:block"></div>', // simple selector
          '<div class="display:flex background-color:blue-100"></div>', // multiple selectors
          '// display:unset\n', // JS comment
          '<Box className="align-items:center justify-content:center">', // React style code
          '<Menu className={ true ? \'gap:space-100\' : \'gap:space-200\' }></Menu>', // conditional React code
          '<Button :class="true ? "color:blue-102" : "color:blue-101"></Button>', // Vue style code
          '<div [ngClass]="{"display:revert" : condition}"></div>', // Angular style code
        ]
      }

      const css = JitCompiler.compile({ tokens, config })

      expect(css).toContain('--blue-100: #0000F1')
      expect(css).toContain('--blue-101: #0000F2')
      expect(css).toContain('--blue-102: var(--blue-100)')
      expect(css).toContain('--space-100: 8px')
      expect(css).toContain('--space-200: 16px')

      expect(css).toContain('.display\\:block { display: block; }')
      expect(css).toContain('.display\\:flex { display: flex; }')
      expect(css).toContain('.background-color\\:blue-100 { background-color: var(--blue-100); }')
      expect(css).toContain('.display\\:unset { display: unset; }')
      expect(css).toContain('.align-items\\:center { align-items: center; }')
      expect(css).toContain('.justify-content\\:center { justify-content: center; }')
      expect(css).toContain('.color\\:blue-101 { color: var(--blue-101); }')
      expect(css).toContain('.color\\:blue-102 { color: var(--blue-102); }')
      expect(css).toContain('.gap\\:space-100 { gap: var(--space-100); }')
      expect(css).toContain('.gap\\:space-200 { gap: var(--space-200); }')
      expect(css).toContain('.display\\:revert { display: revert; }')
    })
  })

})

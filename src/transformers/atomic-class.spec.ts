import { AtomicClassTransformer } from './atomic-class'
import { defaultConfig } from '../config'
import { AtomicClass } from '../ast'

import type { DesignToken } from '../types'
import type { Config } from '../config'

describe('AtomicClassTransformer', () => {
  describe('transform()', () => {
    it('transforms a token into an atomic class', () => {
      const config: Config = defaultConfig
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '#0063bd',
          properties: ['color']
        },
      ]

      const result = AtomicClassTransformer.generate(tokens, config)
        .map((atomicClass: AtomicClass) =>
          atomicClass.toString())

      expect(result).toContain('.color\\:blue-500 { color: var(--blue-500); }')
    })

    it('transforms an alias token into a atomic class', () => {
      const config: Config = defaultConfig
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '#0063bd',
          properties: ['color']
        },
        {
          key: 'brand-primary',
          value: '{blue-500}',
          properties: ['color']
        },
      ]

      const result = AtomicClassTransformer.generate(tokens, config)
        .map((atomicClass: AtomicClass) =>
          atomicClass.toString())

      expect(result).toContain('.color\\:blue-500 { color: var(--blue-500); }')
      expect(result).toContain( '.color\\:brand-primary { color: var(--brand-primary); }') // Expected, since `--brand-primary: var(--blue-500)`
    })


    it('handles empty array', () => {
      const config: Config = defaultConfig
      const tokens: DesignToken[] = []

      const result = AtomicClassTransformer.generate(tokens, config)

      expect(result).toEqual([])
    })

    it('doesn\'t throw an error when property is not a CSS property', () => { // TODO: Discuss whether this is intended
      const config: Config = defaultConfig
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '#0063bd',
          properties: ['boop']
        },
      ]

      const result = AtomicClassTransformer.generate(tokens, config)
        .map((atomicClass: AtomicClass) =>
          atomicClass.toString())

      expect(result).toContain('.boop\\:blue-500 { boop: var(--blue-500); }')
    })


    describe('className()', () => {
      it('constructs a class name', () => {
        const value = '400'
        const config: Config = defaultConfig
        const property = 'width'
        const variable = AtomicClassTransformer.className({ property, value, config })

        expect(variable).toBe('width\\:400')
      })

      it('uses separator provided in config ', () => {
        const value = '400'
        const config: Config = {
          ...defaultConfig,
          rules: {
            namespace: defaultConfig.rules.namespace,
            separator: '-'
          }
        }
        const property = 'width'
        const variable = AtomicClassTransformer.className({ property, value, config })

        expect(variable).toBe('width-400')
      })

      it('uses namespace provided in config ', () => {
        const value = '400'
        const config: Config = {
          ...defaultConfig,
          rules: {
            namespace: 'ds-',
            separator: defaultConfig.rules.separator,
          }
        }
        const property = 'width'
        const variable = AtomicClassTransformer.className({ property, value, config })

        expect(variable).toBe('ds-width\\:400')
      })
    })
  })
})


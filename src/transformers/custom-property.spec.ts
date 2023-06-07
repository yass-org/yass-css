import { CustomPropertyTransformer } from './custom-property'
import { getConfig } from '../config'
import { CustomProperty } from '../ast'

import type { DesignToken } from '../types'
import type { Config } from '../config'

describe('CustomPropertyTransformer()', () => {
  describe('transform()', () => {
    it('transforms a token into a custom property', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '#0063bd'
        },
      ]
      
      const result = CustomPropertyTransformer
        .transform(tokens, config)
        .map((customProperty: CustomProperty) => 
          customProperty.toString())
    
      expect(result).toEqual(['--blue-500: #0063bd'])
    })
    
    it('transforms an alias token into a custom property', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '#0063bd'
        },
        {
          key: 'brand-primary',
          value: '{blue-500}'
        },      
      ]

      const result = CustomPropertyTransformer.transform(tokens, config)
        .map((customProperty: CustomProperty) => 
          customProperty.toString())

      expect(result).toEqual([
        '--blue-500: #0063bd',
        '--brand-primary: var(--blue-500)',      
      ])
    })

    it('orders custom properties to ensure `var()` will resolve', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = [
        {
          key: 'brand-primary',
          value: '{blue-500}'
        },    
        {
          key: 'blue-500',
          value: '#0063bd'
        },  
      ]

      const result = CustomPropertyTransformer.transform(tokens, config)
        .map((customProperty: CustomProperty) => 
          customProperty.toString())

      expect(result).toEqual([
        '--blue-500: #0063bd',
        '--brand-primary: var(--blue-500)',
      ])
    })
    
    it('transforms tokens into custom properties with the correct value', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = [
        {
          key: 'brand-primary',
          value: '{blue-500}'
        },    
        {
          key: 'blue-500',
          value: '#0063bd'
        },  
        {
          key: 'button-color-brand-primary',
          value: '{brand-primary}'
        },
      ]

      const result = CustomPropertyTransformer.transform(tokens, config)
        .map((customProperty: CustomProperty) => 
          customProperty.toString())

      expect(result).toEqual([
        '--blue-500: #0063bd',
        '--brand-primary: var(--blue-500)',
        '--button-color-brand-primary: var(--brand-primary)',
      ])
    })  
    
    
    it('handles empty array', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = []

      const result = CustomPropertyTransformer.transform(tokens, config)

      expect(result).toEqual([])
    })
    
    it('throws an error when alias token cannot be resolved', () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const tokens: DesignToken[] = [
        {
          key: 'blue-500',
          value: '{alias-to-a-token-that-does-not-exist}'
        },
      ]
      
      expect(() => CustomPropertyTransformer.transform(tokens, config)).toThrow(
        new Error('Unable to generate classes for all tokens. You may have an alias token that doesn\'t reference a valid token, or you have two tokens with the same key.')
      )
    })


    describe('property()', () => {
      it('constructs custom property name from token', () => {
        const token: DesignToken = {
          key: 'very-red',
          value: 'rgb(255, 0, 0)',
        }

        const userConfig: Partial<Config> = {}
        const config: Config = getConfig(userConfig)
        const variable = CustomPropertyTransformer.property(token, config)

        expect(variable).toBe('--very-red')
      })

      it('adds namespace when provided in config', () => {
        const token: DesignToken = {
          key: 'very-red',
          value: 'rgb(255, 0, 0)',
        }

        const userConfig: Partial<Config> = {
          rules: {
            namespace: 'gl-',
          }
        }
        const config: Config = getConfig(userConfig)
        const variable = CustomPropertyTransformer.property(token, config)

        expect(variable).toBe('--gl-very-red')
      })

      it('ignores token.name when constructing custom property name', () => {
        const token: DesignToken = {
          key: 'very-red',
          value: 'rgb(255, 0, 0)',
          name: 'red'
        }

        const userConfig: Partial<Config> = {
          rules: {
            namespace: 'gl-',
          }
        }
        const config: Config = getConfig(userConfig)
        const variable = CustomPropertyTransformer.property(token, config)

        expect(variable).toBe('--gl-very-red')
      })  
    })  
  })
})


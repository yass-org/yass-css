import { RootElement, StyleSheet } from '../ast'
import { Config } from '../config'
import { AtomicClassTransformer, CustomPropertyTransformer } from '../transformers'
import rules from '../definitions/css/rules.json'
import { validateTokens } from '../validation'

import type {  DesignToken } from '../types'

export const DefaultCompiler = {

  build({ tokens = [], config }: { tokens: DesignToken[], config: Config }): string {
    const { baseClasses, tokenClasses } = config.stylesheet.include
    if(tokens.length === 0){
      return ''
    }

    const userTokens = validateTokens(tokens)
    const baseCSSTokens: DesignToken[] = rules.flatMap((({ values, property }) => {
      return values.map((value) => ({
        key: value,
        value: value,
        properties: [property],
        customProperty: false,
      }))
    }))

    const stylesheet = new StyleSheet([
    // Add the `:root` first
      new RootElement(
      // Add CSS Custom Properties to :root
        CustomPropertyTransformer.transform(userTokens, config)
      ),

      ...(baseClasses ? AtomicClassTransformer.transform(baseCSSTokens, config) : []),

      ...(tokenClasses ? AtomicClassTransformer.transform(userTokens, config) : [])
    ]).toJSON()

    const { css } = stylesheet

    return css
  }
}

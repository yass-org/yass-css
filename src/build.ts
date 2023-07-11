import { RootElement, StyleSheet } from './ast'
import { Config } from './config'
import { AtomicClassTransformer, CustomPropertyTransformer } from './transformers'
import rules from './definitions/css/rules.json'
import { validateTokens, validateRules } from './validation'

import type {  DesignToken } from './types'

export const build = ({ tokens, config }: { tokens: DesignToken[], config: Config }): string => {
  const { baseClasses, tokenClasses } = config.stylesheet.include
  if(!tokens || tokens.length === 0){
    return ''
  }

  const userTokens = validateTokens(tokens)
  const baseCSSTokens: DesignToken[] = Object
    .keys(validateRules(rules))
    .flatMap(((property: string) => {
      const values = rules[property]

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

    ...(baseClasses ? AtomicClassTransformer
      .transform(baseCSSTokens, config)
      // .filter(isInSourceDirectory)
      : []),

    ...(tokenClasses ? AtomicClassTransformer
      .transform(userTokens, config)
      // .filter(isInSourceDirectory)
      : [])
  ]).toJSON()

  const { css } = stylesheet

  return css
}

import { AtomicClass, RootElement, StyleSheet } from './ast'
import { Config } from './config'
import { AtomicClassTransformer, CustomPropertyTransformer } from './transformers'
import rules from './definitions/css/rules.json'
import { validateTokens, validateRules } from './validation'

import type { DesignToken } from './types'

export const build = ({ tokens, sourceSet, config }: {tokens: DesignToken[], sourceSet?: Set<string>, config: Config}): string => {
  const { baseClasses, tokenClasses } = config.stylesheet.include
  if(!tokens || tokens.length === 0){
    return ''
  }

  const isInSourceDirectory = (atomicClass: AtomicClass) => {
    if(!sourceSet) {
      return true
    }

    return sourceSet.has(atomicClass.selector)
  }

  const validTokens = validateTokens(tokens)
  const validRules = validateRules(rules)

  const stylesheet = new StyleSheet([
    // Add the `:root` first
    new RootElement(
      // Add CSS Custom Properties to :root
      CustomPropertyTransformer.transform(validTokens, config)
    ),

    ...(baseClasses ? AtomicClassTransformer
      .fromCSSRules(validRules, config)
      .filter(isInSourceDirectory) : []),

    ...(tokenClasses ? AtomicClassTransformer
      .transform(validTokens, config)
      .filter(isInSourceDirectory) : [])
  ]).toJSON()

  const { css } = stylesheet

  return css
}

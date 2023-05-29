import { RootElement, StyleSheet } from './ast' 
import { Config } from './config'
import { AtomicClassTransformer, CSSRuleTransformer, CustomPropertyTransformer, ThemeClassTransformer } from './transformers'
import rules from './definitions/css/rules.json'
import { validateTokens, validateRules } from './validation'

import type { DesignToken } from "./types"

export const build = (tokens: DesignToken[], config: Config): string => {
    if(!tokens || tokens.length === 0){
    return ''
  }  

  const validTokens = validateTokens(tokens)
  const validRules = validateRules(rules)

  const stylesheet = new StyleSheet([
    // Add the `:root` first
    new RootElement(
      // Add CSS Custom Properties to :root
      CustomPropertyTransformer.transform(validTokens, config)
    ),
    ...CSSRuleTransformer.transform(rules, config),
    ...ThemeClassTransformer.transform(validTokens, config),
    // Add the atomic classes
    ...AtomicClassTransformer.transform(validTokens, config),
  ]).toJSON()

  const { css } = stylesheet

  return css
}

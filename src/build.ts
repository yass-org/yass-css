import postcss, { Root, Rule } from 'postcss'

import { RootElement, StyleSheet } from './postcss-wrapper' 

import type { DesignToken } from "./types"
import { Config } from './config'
import { CustomPropertyTransformer } from './transformers/custom-properties'
import { AtomicClassTransformer } from './transformers/atomic-classes'
import { validateToken } from './validation'
import { ThemeClassTransformer } from './transformers/theme-classes'


export const build = (tokens: DesignToken[], config: Config): string => {
    if(!tokens || tokens.length === 0){
    return ''
  }  

  const validTokens = tokens.filter((token: DesignToken) => {
    const { isValid, reason } = validateToken(token)
    
    if(!isValid) {
      console.warn('Skipping token: ', reason);
    }

    return isValid
  })

  const stylesheet = new StyleSheet([
    // Add the `:root` first
    new RootElement(
      // Add CSS Custom Properties to :root
      CustomPropertyTransformer.transform(validTokens, config)
    ),
    // TODO: Add theme classes back when we're able to resolve aliases in them
    // ...ThemeClassTransformer.transform(validTokens, config),
    // Add the atomic classes
    ...AtomicClassTransformer.transform(validTokens, config),
  ]).toJSON()
  

  const { css } = postcss().process(stylesheet)

  return css
}

import { RootElement, StyleSheet } from './ast' 
import { Config } from './config'
import { AtomicClassTransformer, CustomPropertyTransformer, ThemeClassTransformer } from './transformers'
import { validateToken } from './validation'

import type { DesignToken } from "./types"

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
    ...ThemeClassTransformer.transform(validTokens, config),
    // Add the atomic classes
    ...AtomicClassTransformer.transform(validTokens, config),
  ]).toJSON()
  

  const { css } = stylesheet

  return css
}

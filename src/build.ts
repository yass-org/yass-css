import { AtomicClass, RootElement, StyleSheet } from './ast' 
import { Config } from './config'
import { AtomicClassTransformer, BaseCSSTransformer, CustomPropertyTransformer } from './transformers'
import rules from './definitions/css/rules.json'
import { validateTokens, validateRules } from './validation'

import type { DesignToken } from './types'
import { arrayContainsSubstring } from './utils'

export const build = (tokens: DesignToken[], directoryContents: string[] | undefined, config: Config): string => {
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

    // Add the base classes
    ...BaseCSSTransformer
      .transform(validRules, config)      
      .filter((atomicClass: AtomicClass) => isReferencedInSourceFolder(atomicClass, directoryContents)),

    // Add the atomic classes
    ...AtomicClassTransformer
      .transform(validTokens, config)
      .filter((atomicClass: AtomicClass) => isReferencedInSourceFolder(atomicClass, directoryContents)),
  ]).toJSON()

  const { css } = stylesheet

  return css
}

const isReferencedInSourceFolder = (atomicClass: AtomicClass, directoryContents: string[] | undefined) => {
  
  // If directoryContents is not defined, then generate all classes, 
  // since we can't determine which ones have been referenced
  if(!directoryContents) {
    return true
  }

  return arrayContainsSubstring(directoryContents, atomicClass.className)
}

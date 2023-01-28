import { Config } from "../config"
import { CustomProperty } from "../postcss-wrapper"
import { DesignToken } from "../types"
import { createCustomPropertyName } from "./create-custom-property-name"
import { isAliasToken } from "./is-alias-token"
import { resolveAliasTokenValue } from "./resolve-alias-value"

const allTokensResolved = (resolvedTokens, tokens) => {
  return Object.keys(resolvedTokens).length === tokens.length  
}

/** 
 * Surprisingly difficult function to write. We need to make sure that the resulting custom properties are 
 * ordered in a way where they are able to be resolved. For example:
 * ```
 * [
 *   { key: 'brand-primary',  value: '{blue-500}' }, 
 *   { key: 'blue-500', value: '#0063bd' },
 * ]
 * 
 * will not automatically be able to resolve, since the `{blue-500}` alias token is referenced before it is declared.
 * 
 * To solve this, we repeatedly iterate over the tokens array, adding any tokens that are able to be resolved. 
 * ```
 * @returns 
 */
export const resolveCustomProperties = (tokens: DesignToken[], config: Config): CustomProperty[] => {
  const resolvedTokens: { [key: string]: CustomProperty} = {}
  let counter = 0
  
  if(!tokens || tokens.length === 0) {
    return []
  }
  
  while(!allTokensResolved(resolvedTokens, tokens) && counter < tokens.length) {
    tokens.forEach((token) => {
      const customPropertyName = createCustomPropertyName(token, config)
      if(!isAliasToken(token)) {
        resolvedTokens[token.key] =  new CustomProperty({ key: customPropertyName, value: token.value })
        return
      }

      const resolvedValue = resolveAliasTokenValue(token, resolvedTokens)  
      if(resolvedValue) {
        resolvedTokens[token.key] = new CustomProperty({ key: customPropertyName, value: `var(--${resolvedValue})` })
      }
    })
    counter++
  }

  if(!allTokensResolved(resolvedTokens, tokens)) {
    throw new Error("Unable to resolve tokens. You may have an alias token that doesn't reference a valid token.");
  }
  
  return Object.values(resolvedTokens)
}

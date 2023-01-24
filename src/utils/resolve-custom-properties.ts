import { Config } from "../config"
import { CustomProperty } from "../postcss-wrapper"
import { DesignToken } from "../types"
import { createCustomPropertyName } from "./create-custom-property-name"
import { isAliasToken } from "./is-alias-token"
import { resolveAliasTokenValue } from "./resolve-alias-value"



export const resolveCustomProperties = (tokens: DesignToken[], config: Config): CustomProperty[] => {
  const resolvedTokens = {}
  let counter = 0
  
  if(!tokens || tokens.length === 0) {
    return []
  }
  
  while(counter < tokens.length) {
    tokens.forEach((token) => {
      const customPropertyName = createCustomPropertyName(token, config)
      if(!isAliasToken(token)) {
        resolvedTokens[token.key] =  new CustomProperty({ key: customPropertyName, value: token.value })
        return
      }

      const resolvedValue = resolveAliasTokenValue(token, resolvedTokens)  
      if(resolvedValue) {
        resolvedTokens[token.key] =  new CustomProperty({ key: customPropertyName, value: `var(--${resolvedValue})` })
      }
    })
    counter++
  }

  return Object.values(resolvedTokens)
}

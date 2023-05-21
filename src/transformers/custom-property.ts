import { Config } from "../config"
import { CustomProperty } from "../ast"
import { DesignToken } from "../types"

export const CustomPropertyTransformer = {  

  /** 
   * Surprisingly difficult function to write. We need to make sure that the resulting custom properties are 
   * ordered in a way where they are able to be transformed. For example:
   * ```
   * [
   *   { key: 'brand-primary',  value: '{blue-500}' }, 
   *   { key: 'blue-500', value: '#0063bd' },
   * ]
   * ```
   * 
   * will not automatically be able to transformed, since the `{blue-500}` alias token is referenced before it is declared.
   * 
   * To solve this, we repeatedly iterate over the tokens array, adding any tokens that are able to be transformed. 
   */
  transform(tokens: DesignToken[], config: Config): CustomProperty[] {
    const customProperties: CustomProperty[] = []
    const seen: Set<string> = new Set()
    let counter = 0
    
    while(seen.size < tokens.length) {
      tokens.forEach((token) => {
        if(seen.has(token.key)) {
          // Token has already been transformed, we can skip
          return
        }

        // If it's a simple token, like: `{ key: 'blue-500', value: '#0063bd' }`, we can immediately transform it it
        if(!CustomPropertyTransformer.isAliasToken(token)) {
          const customPropertyName = CustomPropertyTransformer.property(token, config)
          const property = new CustomProperty({ key: customPropertyName, value: token.value })
          
          seen.add(token.key)
          customProperties.push(property)
          return
        }

        // Else, it's an alias token, like `{ key: 'brand-primary',  value: '{blue-500}' }`, so,
        // get the alias value, e.g. `blue-500`
        const alias = CustomPropertyTransformer.aliasValue(token)  

        // If the alias has already been seen, then we are able add it to the end of 
        // the array, since the value it transforms to has previously been added 
        if(seen.has(alias)) {
          const customPropertyName = CustomPropertyTransformer.property(token, config)
          const property = new CustomProperty({ key: customPropertyName, value: `var(--${alias})` })

          seen.add(token.key)
          customProperties.push(property)
        }

        // Otherwise, ignore the token, until the next iteration, where we will try again once
        // more tokens have been transformed.
      })

      // The while loop should never be able to iterate more than tokens.length. If this happens, 
      // then it's likely that the user has added tokens that are unable to be transformed.
      if(counter++ >= tokens.length) {
        throw new Error("Unable to generate classes for all tokens. You may have an alias token that doesn't reference a valid token, or you have two tokens with the same key.");
      }
    }

    return customProperties
  },

  aliasValue(token: DesignToken) {
    return token.value.slice(1, token.value.length - 1)
  },

  property(token: DesignToken, config: Config): string {
    const { key } = token
    const namespace = config.rules.namespace

    return `--${namespace}${key}`
  },

  isAliasToken(token: DesignToken) {
    const { value } = token
    return value[0] === '{' && value[value.length - 1] === '}'
  },

  // TODO: Figure out a nice way to DRY this
  resolveValue(value: string) {
    if(value[0] === '{' && value[value.length - 1] === '}') {
      return `var(--${value.slice(1, value.length - 1)})`
    }

    return value
  }
}

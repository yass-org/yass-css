import { CSSRules, DesignToken } from '../types'

export const validateToken = (
  token: DesignToken
): { isValid: boolean; reason?: string } => {
  if (!token.key) {
    return { isValid: false, reason: 'A token must define a key' }
  }

  if (!token.value) {
    return { isValid: false, reason: 'A token must define a value' }
  }

  const hasProperties = token.properties && token.properties.length > 0

  if (!(token.category || hasProperties)) {
    return {
      isValid: false,
      reason: 'A token must define either a category, or a list of properties',
    }
  }

  return { isValid: true }
}

export const validateTokens = (tokens: DesignToken[]) => {
  const seenTokens = {}

  return tokens.filter((token: DesignToken) => {
    const { isValid, reason } = validateToken(token)
    
    if(!isValid) {
      console.warn(`Skipping token: '${JSON.stringify(token)}'.`, reason)
    }

    if(seenTokens[token.key]) {
      console.warn('Duplicate token key detected:')
      console.warn(`1. ${JSON.stringify(token)}`)
      console.warn(`2. ${JSON.stringify(seenTokens[token.key])}`)
      console.warn('It is strongly recommended all token keys be unique as this will result in malformed CSS classes.')
    }

    seenTokens[token.key] = token
    return isValid
  })
}

export const validateProperty = (property: string): { isValid: boolean; reason?: string } => {

  if(!property) {
    return { 
      isValid: false,
      reason: 'CSS property was not present.'
    }
  }

  const validPropertySyntaxPattern = /[a-z\-]/

  if(!validPropertySyntaxPattern.test(property)) {
    return { 
      isValid: false,
      reason: `CSS property '${property}' is not valid CSS property syntax`
    }
  }
  return { isValid: true }
}

export const validateRules = (rules: CSSRules): CSSRules => {
  const validRules = {}

  Object.keys(rules).forEach((property) => {

    const { isValid, reason } = validateProperty(property)

    if(!isValid) {
      console.warn(`Skipping CSS property: '${property}'.`, reason)
      return
    }

    const values = rules[property]

    if(!values || !values.length) {
      return
    }

    validRules[property] = values
  })

  return validRules
}

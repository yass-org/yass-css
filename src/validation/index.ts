import { DesignToken } from "../types";

export const validateToken = (
  token: DesignToken
): { isValid: boolean; reason?: string } => {
  if (!token.key) {
    return { isValid: false, reason: "A token must define a key" };
  }

  if (!token.value) {
    return { isValid: false, reason: "A token must define a value" };
  }

  const hasProperties = token.properties && token.properties.length > 0;

  if (!(token.category || hasProperties)) {
    return {
      isValid: false,
      reason: "A token must define either a category, or a list of properties",
    };
  }

  return { isValid: true };
};

export const validateTokens = (tokens: DesignToken[]) => {
  const seenTokens = {}

  return tokens.filter((token: DesignToken) => {
    const { isValid, reason } = validateToken(token)
    
    if(!isValid) {
      console.warn(`Skipping token: '${JSON.stringify(token)}'.`, reason);
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
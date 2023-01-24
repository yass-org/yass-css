import { isAliasToken } from "./is-alias-token"

const getTokenName = (token) => {
  if(isAliasToken(token)) {
    return token.value.slice(1, token.value.length - 1)
  }  
}

export const resolveAliasTokenValue = (token, resolvedTokens) => {
  const tokenName = getTokenName(token)
  if(resolvedTokens[tokenName]) {
    return tokenName
  }
}
import { DesignToken } from "../types";


export const isAliasToken = (token: DesignToken) => {
  const { value } = token
  return value[0] === '{' && value[value.length - 1] === '}'
}
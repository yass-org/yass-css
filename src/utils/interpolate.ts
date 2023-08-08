import type { DesignToken } from '../types'

export const interpolate = (str: string, tokens: DesignToken[]) => {
  const interpolationMarkerPattern = /(?<!\\){([^}]+)}/g
  const matches = str.match(interpolationMarkerPattern) || []

  matches.forEach((match: string) => {
    const variable = match.slice(1, -1)

    const token = tokens.find(({ key }: DesignToken) => variable === key)

    if(!token) {
      throw new Error(`token "${match}" not in scope.`)
    }

    str = str.replace(match, token.value)
  })

  return str
}

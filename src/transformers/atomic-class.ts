import { AtomicClass } from '../ast'
import { CustomPropertyTransformer } from './custom-property'

import type { DesignToken } from '../types'
import type { Config } from '../config'

import pseudos from '../definitions/css/pseudos'
import escapeSequences from '../definitions/css/escape-sequences.json'
import scale from '../definitions/categories/scale.json'
import color from '../definitions/categories/color.json'
import type { YassClassUsage } from '../compilers'

const categoryMap = {
  'color': color,
  'scale': scale,
}

export const AtomicClassTransformer = {

  /**
   * Converts an array of `DesignToken` objects into an array of Yass atomic classes
   */
  transform(tokens: DesignToken[], config: Config): AtomicClass[] {
    const includePseudos = config.stylesheet.include.pseudos

    return tokens
      .flatMap((token: DesignToken) => {
        const { category, properties: userProperties, name, key } = token
        const properties = userProperties || categoryMap[category]

        return properties.flatMap((property: string) => {
          const value = token.customProperty === false ? token.value :`var(${CustomPropertyTransformer.property(token, config)})`

          return [
            // basic atomic class, e.g. `display:block`
            new AtomicClass({
              className: AtomicClassTransformer.className({property, token: name || key, config}),
              selector: AtomicClassTransformer.selector({property, token: name || key, config}),
              declaration: {
                property,
                value,
              }
            }),

            // pseudo variants e.g. `display:block:hover`
            ...(includePseudos ? pseudos.selectors.map((pseudo: string) => {
              return new AtomicClass({
                className: AtomicClassTransformer.className({property, token: name || key, pseudos: [pseudo], config}),
                selector: AtomicClassTransformer.selector({property, token: name || key, pseudos: [pseudo], config}),
                declaration: {
                  property,
                  value,
                }
              })
            }) : [])
          ]
        })
      })
  },

  fromUsages({ usages, config }: { usages: YassClassUsage[], config: Config }): AtomicClass[] {
    // Since a user could reference the same class twice, e.g. two `<div>`'s with `display:block,
    // we need to keep track of a `seen` so we don't add duplicate class definitions to the stylesheet
    const seen = new Set<string>()

    return usages.map(({ property, value, pseudos, token }: YassClassUsage) => {
      return new AtomicClass({
        className: AtomicClassTransformer.className({property, token, pseudos, config}),
        selector: AtomicClassTransformer.selector({property, token, pseudos, config}),
        declaration: {
          property,
          value,
        }
      })

    }).filter(({ className }: AtomicClass) => {
      if(seen.has(className)) {
        return false
      }
      seen.add(className)
      return true
    })
  },

  className({property, token, pseudos = [], config }: {property: string, token: string, pseudos?: string[], config: Config}): string {
    const { namespace, separator } = config.rules
    const escapedSeparator = escapedCssString(separator)
    const className = `${namespace}${property}${escapedSeparator}${token}`

    return `${className}${pseudos.map((pseudo: string) => `\\${escapedCssString(pseudo)}${pseudo}`).join('')}`
  },

  selector({ property, token, pseudos = [], config }: { property: string, token: string, pseudos?: string[], config: Config }): string {
    const { namespace, separator } = config.rules

    const className = `${namespace}${property}${separator}${token}`

    return `${className}${pseudos.join('')}`
  }
}

const escapedCssString = (str: string): string => {
  return escapeSequences.class.reduce((escapedString, specialChar) => {
    return escapedString.replace(specialChar, `\\${specialChar}`)
  }, str)
}

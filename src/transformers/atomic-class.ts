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
    const validPseudoSelectors = config.stylesheet.include.pseudos ? pseudos.selectors : []

    return tokens
      .flatMap((token: DesignToken) => {
        const { category, properties: userProperties, name, key } = token
        const properties = userProperties || categoryMap[category]

        return properties.flatMap((property: string) => {
          const value = token.customProperty === false ? token.value :`var(${CustomPropertyTransformer.property(token, config)})`

          return [
            // basic atomic class, e.g. `display:block`
            new AtomicClass({
              className: AtomicClassTransformer.className({ property, value: name || key, config }),
              selector: AtomicClassTransformer.selector({ property, value: name || key, config }),
              declaration: {
                property,
                value,
              }
            }),

            // pseudo variants e.g. `display:block:hover`
            ...validPseudoSelectors.map((pseudo: string) => {
              return new AtomicClass({
                className: AtomicClassTransformer.className({ property, value: name || key, pseudo, config }),
                selector: AtomicClassTransformer.selector({ property, value: name || key, pseudos: [pseudo], config }),
                declaration: {
                  property,
                  value,
                }
              })
            })
          ]
        })
      })
  },

  fromUsages({ usages, config }: { usages: YassClassUsage[], config: Config }): AtomicClass[] {
    // Since a user could reference the same class twice, e.g. two `<div>`'s with `display:block,
    // we need to keep track of a `seen` so we don't add duplicate class definitions to the stylesheet
    const seen = new Set<string>()

    return usages.flatMap(({ property, value, pseudos, token }: YassClassUsage) => {
      if(pseudos.length > 0) {
        return pseudos.map((pseudo: string) => new AtomicClass({
          className: AtomicClassTransformer.className({ property, value: token, pseudos, pseudo, config }),
          selector: AtomicClassTransformer.selector({ property, value: token, pseudos, config }),
          declaration: {
            property,
            value,
          }
        }))
      }

      return [
        new AtomicClass({
          className: AtomicClassTransformer.className({ property, value: token, config }),
          selector: AtomicClassTransformer.selector({ property, value: token, config }),
          declaration: {
            property,
            value,
          }
        })
      ]

    }).filter(({ className }: AtomicClass) => {
      if(seen.has(className)) {
        return false
      }

      seen.add(className)

      return true
    })
  },

  className({ property, value, pseudos = [], pseudo = '', config }: {property: string, value: string, pseudos?: string[], pseudo?: string, config: Config}): string {
    const { namespace, separator } = config.rules
    const escapedSeparator = escapedCssString(separator)
    const className = `${namespace}${property}${escapedSeparator}${value}`

    if(pseudo && pseudos.length) {
      return `${className}\\${pseudos.join('\\')}${pseudo}`
    }

    return className
  },

  selector({ property, value, pseudos = [], config }: { property: string, value: string, pseudos?: string[], config: Config }): string {
    const { namespace, separator } = config.rules

    const className = `${namespace}${property}${separator}${value}`

    return `${className}${pseudos.join('')}`
  }
}

const escapedCssString = (str: string): string => {
  return escapeSequences.class.reduce((escapedString, specialChar) => {
    return escapedString.replace(specialChar, `\\${specialChar}`)
  }, str)
}

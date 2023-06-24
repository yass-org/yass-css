import { AtomicClass } from '../ast'
import { CustomPropertyTransformer } from './custom-property'

import type { DesignToken } from '../types'
import type { Config } from '../config'

import pseudos from '../definitions/css/pseudos'
import escapeSequences from '../definitions/css/escape-sequences.json'
import scale from '../definitions/categories/scale.json'
import color from '../definitions/categories/color.json'

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
                className: AtomicClassTransformer.className({property, token: name || key, pseudo, config}),
                selector: AtomicClassTransformer.selector({property, token: name || key, pseudo, config}),
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

  className({property, token, pseudo, config }: {property: string, token: string, pseudo?: string, config: Config}): string {
    const { namespace, separator } = config.rules
    const escapedSeparator = escapedCSSString(separator)
    const className = `${namespace}${property}${escapedSeparator}${token}`

    if(pseudo) {
      return `${className}\\${pseudo}${pseudo}`
    }

    return className
  },

  selector({ property, token, pseudo, config }: { property: string, token: string, pseudo?: string, config: Config }): string {
    const { namespace, separator } = config.rules

    const className = `${namespace}${property}${separator}${token}`

    if(pseudo) {
      return `${className}${pseudo}`
    }

    return className
  }
}

const escapedCSSString = (str: string): string => {
  return escapeSequences.class.reduce((escapedString, specialChar) => {
    return escapedString.replace(specialChar, `\\${specialChar}`)
  }, str)
}

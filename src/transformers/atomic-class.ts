import { AtomicClass } from '../ast'
import { CustomPropertyTransformer } from './custom-property'
import color from '../definitions/categories/color.json'
import scale from '../definitions/categories/scale.json'
import pseudos from '../definitions/css/pseudos.json'

import type { DesignToken } from '../types'
import type { Config } from '../config'

const categoryMap = {
  'color': color,
  'scale': scale,
}

interface ClassName {
  property: string;
  token: DesignToken;
  config: Config
}

export const AtomicClassTransformer = {

  /**
   * Converts an array of `DesignToken` objects into an array of Yass atomic classes
   */
  transform(tokens: DesignToken[], config: Config): AtomicClass[] {  
    return tokens
      .flatMap((token: DesignToken) => {
        const { category, properties: userProperties } = token 
        const properties = userProperties || categoryMap[category]

        return properties.map((property: string) => {
          return new AtomicClass({
            className: AtomicClassTransformer.className(property, token, config),
            declaration: {
              property,
              value: `var(${CustomPropertyTransformer.property(token, config)})`,
            }
          })
        })
      })
  },

  className(property: string, token: DesignToken, config: Config): string {
    return `${config.rules.namespace}${property}${config.rules.separator}${token.name || token.key}`
  }
}

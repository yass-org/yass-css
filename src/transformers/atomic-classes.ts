import { AtomicClass } from "../postcss-wrapper";
import { CustomPropertyTransformer } from "./custom-properties";
import color from '../definitions/categories/color.json'
import scale from '../definitions/categories/scale.json'

import type { DesignToken } from "../types";
import type { Config } from "../config";

const categoryMap = {
  'color': color,
  'scale': scale,
}

export class AtomicClassTransformer {

  static transform(tokens: DesignToken[], config: Config): AtomicClass[] {
    return tokens.flatMap((token: DesignToken) => {
      const { category, properties: userProperties } = token 
      const properties = userProperties || categoryMap[category]

      return properties.map((property: string) => (
        new AtomicClass({
          className: AtomicClassTransformer.className(property, token, config),
          declaration: {
            property,
            value: `var(${CustomPropertyTransformer.property(token, config)})`,
          }
        })
      ))
    })
  }

  static className(property: string, token: DesignToken, config: Config): string {
    return `${config.token.namespace}${property}${config.token.separator}${token.name || token.key}`
  }
}

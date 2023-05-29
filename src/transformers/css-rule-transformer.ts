import { AtomicClass } from "../ast";

import type { Config } from "../config";
import type { CSSRules } from "../types";


export const CSSRuleTransformer = {
  /**
   * Converts an array of CSS rule objects into an array of Yass atomic classes
   */
  transform(rules: CSSRules, config: Config): AtomicClass[] {
    return Object.entries(rules).flatMap(([property, values]: [string, string[]]) => {
      return values.map((value: string) => (
        new AtomicClass({
          className: CSSRuleTransformer.className(property, value, config),
          declaration: {
            property,
            value,
          }
        })
      ))
    })
  },

  className(property: string, value: string, config: Config): string {
    return `${config.rules.namespace}${property}${config.rules.separator}${value}`
  }
}

import { Config } from "../config";
import { DesignToken } from "../types";
import { CustomPropertyTransformer } from "./custom-property";
import { CustomProperty, ThemeClass } from "../ast";

export class ThemeClassTransformer {

  static transform(tokens: DesignToken[], config: Config) {
    if(config.stylesheet.include.themeClasses === false) {
      return []
    }

    const themesBuckets: { [theme: string]: ThemeClass } = {}

    tokens.forEach((token: DesignToken) => {
      const { themes = {} } = token

      Object.keys(themes).forEach((theme: string) => {
        if(!themesBuckets[theme]) {
          themesBuckets[theme] = new ThemeClass({ selector: `.${theme}` })
        }
                
        themesBuckets[theme].append(new CustomProperty({
          key: CustomPropertyTransformer.property(token, config),
          value: CustomPropertyTransformer.resolveValue(themes[theme]),
        }))
      })
    })

    return Object.values(themesBuckets)
  }
}
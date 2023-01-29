import { Config } from "../config";
import { DesignToken } from "../types";
import { CustomPropertyTransformer } from "./custom-properties";
import { CustomProperty, ThemeClass } from "../postcss-wrapper";

export class ThemeClassTransformer {

  static transform(tokens: DesignToken[], config: Config) {
    const themesBuckets: { [theme: string]: ThemeClass } = {}

    tokens.forEach((token: DesignToken) => {
      const { themes = [] } = token

      Object.keys(themes).forEach((theme: string) => {
        if(!themesBuckets[theme]) {
          themesBuckets[theme] = new ThemeClass({ selector: `.${theme}` })
        }

        const themedValue = themes[theme]
        
        themesBuckets[theme].append(new CustomProperty({
          key: CustomPropertyTransformer.property(token, config),
          value: themedValue, // TODO: Resolve alias values
        }))
      })
    })

    return Object.values(themesBuckets)
  }
}
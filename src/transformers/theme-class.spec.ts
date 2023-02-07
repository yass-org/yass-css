import { ThemeClassTransformer } from "./theme-class"
import { getConfig } from "../config";
import { ThemeClass } from "../ast";

import type { DesignToken } from "../types";
import type { UserConfig, Config } from "../config";

describe("ThemeClassTransformer", () => {
  describe('transform()', () => {
    it("transforms a token into a theme class", () => {
      const config: Config = getConfig({})
      const tokens: DesignToken[] = [
        {
          key: 'brand-primary',
          value: '#000000',
          properties: ['color'],
          themes: {
            dark: '#FFFFFF'
          }
        },
      ]
      
      const result = ThemeClassTransformer.transform(tokens, config)
        .map((themeClass: ThemeClass) => 
          themeClass.toString())
    
      expect(result).toEqual([
        '.dark {\n  --brand-primary: #FFFFFF\n}'
      ])
    })

    it("handles an empty array", () => {
      const config: Config = getConfig({})
      const tokens: DesignToken[] = []
      
      const result = ThemeClassTransformer.transform(tokens, config)
    
      expect(result).toEqual([])

    })    

    it("doesn't generate theme classes when config.stylesheet.include.themeClasses is `false`", () => {
      const config: Config = getConfig({
        stylesheet: {
          include: {
            themeClasses: false,
          }
        }
      })
      
      const tokens: DesignToken[] = [
        {
          key: 'brand-primary',
          value: '#000000',
          properties: ['color'],
          themes: {
            dark: '#FFFFFF'
          }
        },
      ]
      
      const result = ThemeClassTransformer.transform(tokens, config)

      expect(result).toEqual([])
    })
  })
})

import postcss, { Root, Rule, Declaration } from 'postcss'

import color from './definitions/categories/color.json'
import scale from './definitions/categories/scale.json'

import type { DesignToken } from "./types"
import { createVariableName } from './utils/create-variable-name'
import { Config } from './config'

const categoryMap = {
  'color': color,
  'scale': scale,
}


export const build = (tokens: DesignToken[], config: Config): string => {
  const root = new Root()
  
  root.append(buildStyleSheet(tokens))
  
  const css = postcss().process(root).css

  return css
}

const buildStyleSheet = (tokens: DesignToken[]): Root => {
  const variables = new Rule({ selector: ':root' })
  const themes: { [theme: string]: Rule } = {}
  const classes = new Root()

  tokens.forEach((token: DesignToken) => {
    const { name, category, theme, value, properties: userProperties } = token

    // Create Variables
    variables.append(new Declaration({ prop: createVariableName(token), value }))

    // Create theme classes
    if(theme) {
      Object.keys(theme).forEach((themeName: string) => {
        if(!themes[themeName]) {
          themes[themeName] = new Rule({ selector: `.${themeName}` })
        }
        const value = theme[themeName]

        themes[themeName].append(new Declaration({ prop: createVariableName(token), value }))
      })
    }

    const properties = userProperties || categoryMap[category]
    
    properties.forEach((property: string) => {
      
      // Create atomic classes
      const declaration = new Declaration({
        prop: property,
        value: `var(${createVariableName(token)})`,
      })

      const rule = new Rule({
        selector: `.${property}\\:${name}`
      }).append(declaration)

      classes.append(rule)
    })
      
  })

  return new Root().append(
    variables,
    Object.values(themes),
    classes,
  )
}

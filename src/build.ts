import postcss, { Root, Rule } from 'postcss'

import { AtomicClass, CustomProperty, RootElement } from './postcss-wrapper' 
import color from './definitions/categories/color.json'
import scale from './definitions/categories/scale.json'

import type { DesignToken } from "./types"
import { createCustomPropertyName } from './utils/create-custom-property-name'
import { Config } from './config'

const categoryMap = {
  'color': color,
  'scale': scale,
}


export const build = (tokens: DesignToken[], config: Config): string => {
  const root = new Root()
  
  root.append(buildStyleSheet(tokens, config))
  
  const css = postcss().process(root).css

  return css
}

const buildStyleSheet = (tokens: DesignToken[], config: Config): Root => {
  if(tokens.length === 0){
    return new Root()
  }

  const customProperties = []
  const themesRules: { [theme: string]: Rule } = {}
  const classes = new Root()

  tokens.forEach((token: DesignToken) => {
    const { isValid: isValidToken, reason } = validateToken(token)
    if(!isValidToken) {
      console.warn('Skipping token: ', reason);
      return
    }

    const { key, value, name, category, themes = [], properties: userProperties } = token

    // Create custom properties
    const customProperty = new CustomProperty({
      key: createCustomPropertyName(token, config),
      value, // TODO: Resolve alias values
    })
    customProperties.push(customProperty.toJSON())

    // Create theme classes
    Object.keys(themes).forEach((theme: string) => {
      
      if(!themesRules[theme]) {
        themesRules[theme] = new Rule({ selector: `.${theme}` })
      }

      const themedValue = themes[theme]
      
      themesRules[theme].append(new CustomProperty({
        key: createCustomPropertyName(token, config),
        value: themedValue, // TODO: Resolve alias values
      }).toJSON())
    })

    const properties = userProperties || categoryMap[category]
    
    properties.forEach((property: string) => {
      
      // Create atomic classes
      const atomicClass = new AtomicClass({
        className: `${property}\\:${name || key}`,
        declaration: {
          property,
          value: `var(${customProperty.key})`,
        }
      })
      classes.append(atomicClass.toJSON())
    })
  })

  return new Root().append(
    new RootElement().toJSON().append(customProperties),
    Object.values(themesRules),
    classes,
  )
}


export const validateToken = (token: DesignToken): { isValid: boolean, reason?: string } => {

  if(!(token.key)) {
    return { isValid: false, reason: 'A token must define a key' }
  }

  if(!(token.value)) {
    return { isValid: false, reason: 'A token must define a value' }
  }

  const hasProperties = token.properties && token.properties.length > 0

  if(!(token.category || hasProperties)) {
    return { isValid: false, reason: 'A token must define either a category, or a list of properties' }
  }

  return { isValid: true }
}

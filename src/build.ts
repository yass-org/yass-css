import postcss, { Root, Rule } from 'postcss'

import { AtomicClass, CustomProperty, RootElement } from './postcss-wrapper' 
import color from './definitions/categories/color.json'
import scale from './definitions/categories/scale.json'

import type { DesignToken } from "./types"
import { createCustomPropertyName } from './utils/create-custom-property-name'
import { Config } from './config'
import { resolveCustomProperties } from './utils/resolve-custom-properties'

const categoryMap = {
  'color': color,
  'scale': scale,
}


export const build = (tokens: DesignToken[], config: Config): string => {
  if(tokens.length === 0){
    return ''
  }  

  const validTokens = tokens.filter((token: DesignToken) => {
    const { isValid, reason } = validateToken(token)
    
    if(!isValid) {
      console.warn('Skipping token: ', reason);
    }

    return isValid
  })

  const root = new Root()

  root.append(buildCustomProperties(validTokens, config))
  root.append(buildThemeClasses(validTokens, config))
  root.append(buildAtomicClasses(validTokens, config))

  const { css } = postcss().process(root)

  return css
}

export const buildCustomProperties = (tokens: DesignToken[], config: Config): Rule => {  
  const customProperties = resolveCustomProperties(tokens, config)

  const root = new RootElement()
  root.appendAll(customProperties)

  return root.toJSON()
}

const buildThemeClasses = (tokens: DesignToken[], config: Config) => {
  const themesClassBuckets: { [theme: string]: Rule } = {}
  
  tokens.forEach((token: DesignToken) => {
    const { themes = [], properties: userProperties } = token

    Object.keys(themes).forEach((theme: string) => {
      if(!themesClassBuckets[theme]) {
        themesClassBuckets[theme] = new Rule({ selector: `.${theme}` })
      }

      const themedValue = themes[theme]
      
      themesClassBuckets[theme].append(new CustomProperty({
        key: createCustomPropertyName(token, config),
        value: themedValue, // TODO: Resolve alias values
      }).toJSON())
    })
  })

  return Object.values(themesClassBuckets)
}

const buildAtomicClasses = (tokens: DesignToken[], config: Config): Root => {

  const classes = new Root()

  tokens.forEach((token: DesignToken) => {
    const { isValid: isValidToken, reason } = validateToken(token)
    if(!isValidToken) {
      console.warn('Skipping token: ', reason);
      return
    }

    const { key, value, name, category, themes = [], properties: userProperties } = token


    const properties = userProperties || categoryMap[category]
    const customProperty = new CustomProperty({ key: createCustomPropertyName(token, config), value })

    properties.forEach((property: string) => {
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

  return new Root().append(classes)
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

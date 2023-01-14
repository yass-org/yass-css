import ts, { factory } from 'typescript'

import color from './definitions/categories/color.json'
import scale from './definitions/categories/scale.json'

import type { DesignToken } from "./types"

const categoryMap = {
  'color': color,
  'scale': scale,
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

const toPascalCase = (text) => {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);

}

// TODO: Do this using the TS AST once we validate that the types are nice to work with 
export const buildTypes = (userTokens: DesignToken[], cssTokens: DesignToken[]): string => {
  
  const buckets = {}

  userTokens.forEach((token: DesignToken) => {
    const properties = token.properties || categoryMap[token.category]
    properties.forEach((property: string) => {
      if(!buckets[property]) {
        buckets[property] = []
      }
      buckets[property].push(`${property}:${token.name}`)
    })
  })

  cssTokens.forEach((token: DesignToken) => {
    
    token.properties.forEach((property: string) => {
      if(!buckets[property]) {
        buckets[property] = []
      }
      buckets[property].push(`${property}:${token.name}`)
    })
  })

  let types = '// DO NOT EDIT DIRECTLY. THIS FILE WAS GENERATED WITH YASS\n\n'
  Object.keys(buckets).forEach((bucketName) => {
    const typeName = toPascalCase(bucketName)
    const values = buckets[bucketName].join('\' | \'')
    types += `export type ${typeName} = \'${values}\'\n`
  })
  
  return types
}

import postcss from "postcss"
import { 
  globalTokenDefinitions,
  baseCSSDefinitions,
} from "../rule-definitions/index"
import { 
  root as rootTemplate,
  rule as ruleTemplate,
} from './templates'
import { isRuleDefinitionArray } from './types'

import type { 
  PropertyDefinition,
  RuleDefinition,
} from "../rule-definitions/types"

export const build = () => {
  // Convert the object representation of the design system into a JSON AST that postcss understands
  const root = rootTemplate()
  const processor = postcss([]);

  // Append the various types of rules we want to create
  root.nodes = [
    ...generate(baseCSSDefinitions, '.'),
    ...generate(globalTokenDefinitions, '.'),
  ]

  // Turn the JSON AST representation into an actual AST
  let rehydrated = postcss.fromJSON(root)

  // Render the AST as actual CSS
  const css = processor.process(rehydrated).css

  return css
}

const generate = (definitions: RuleDefinition[], selector: string) => {
  const rules = []
  
  definitions.forEach((definition) => {
    const { propertyNames, propertyValues, separator } = definition

    propertyNames.forEach((propertyName) => {

      if(isRuleDefinitionArray(propertyValues)) {
        const ruleDefinitions = propertyValues as RuleDefinition[]
        rules.push(generate(ruleDefinitions, `${selector}${propertyName}${separator}`))
        return
      } 
      const propertyDefinitions = propertyValues as PropertyDefinition[]

      propertyDefinitions.forEach(({ token, propertyValue }) => {

        const rule = ruleTemplate({ 
          selector: `${selector}${propertyName}${separator}${token}`, // e.g. .padding:300
          propertyName, // e.g. padding
          propertyValue, // e.g. 6px
        })

        rules.push(rule)
      })
    })
  })

  return rules
}

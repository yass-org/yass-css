import postcss from "postcss"
import { 
  globalTokenDefinitions,
  baseCSSDefinitions,
} from "../rule-definitions/index"
import { 
  root as rootTemplate,
  rule as ruleTemplate,
} from './templates'

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
    ...generate(baseCSSDefinitions),
    ...generate(globalTokenDefinitions),
  ]

  // Turn the JSON AST representation into an actual AST
  let rehydrated = postcss.fromJSON(root)

  // Render the AST as actual CSS
  const css = processor.process(rehydrated).css

  return css
}

/**
 * definitions has to be an array of objects where each object conforms to the following shape:
 *  {
 *    "propertyNames": [ "display" ],
 *    "propertyValues": [
 *      { "token": "flex", "propertyValue": "flex" },
 *      ... etc
 *    ]
 *  }
 * 
 */
const generate = (definitions) => {
  const rules = []
  
  definitions.forEach((definition) => {
    const { propertyNames, propertyValues, separator }: RuleDefinition = definition

    propertyNames.forEach((propertyName) => {

      propertyValues.forEach(({ token, propertyValue }) => {
        const selector = `.${propertyName}\\${separator}${token}`

        const rule = ruleTemplate({ 
          selector, // e.g. .padding:300
          propertyName, // e.g. padding
          propertyValue, // e.g. 6px
        })

        rules.push(rule)
      })
    })
  })

  return rules
}

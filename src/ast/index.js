import postcss from "postcss";
import globalTokens from "../rule-definitions/global-tokens.js";
import baseCSS from "../rule-definitions/base-css.js";
import { 
  root as rootTemplate,
  rule as ruleTemplate,
} from './templates.js'


export const build = () => {
  // Convert the object representation of the design system into a JSON AST that postcss understands
  const root = rootTemplate()
  const processor = postcss([]);

  // Append the various types of rules we want to create
  root.nodes = [
    ...generate(baseCSS),
    ...generate(globalTokens),
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
    const { propertyNames, propertyValues } = definition

    propertyNames.forEach((propertyName) => {
      propertyValues.forEach(({ token, propertyValue }) => {
        const selector = `.${propertyName}\\:${token}`

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

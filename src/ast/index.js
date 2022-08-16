import postcss from "postcss";
import * as baseRules from './base-css-rules.js';
import * as globalTokenRules from './global-token-rules.js';


const template = () => ({
  "type": "root",
  "nodes": []
})

export const generate = () => {
  // Convert the object representation of the design system into a JSON AST that postcss understands
  const root = template()
  const processor = postcss([]);

  // Append the various types of rules we want to create
  root.nodes = [
    ...baseRules.generate(),
    ...globalTokenRules.generate(),
  ]

  // Turn the JSON AST representation into an actual AST
  let rehydrated = postcss.fromJSON(root)

  // Render the AST as actual CSS
  const css = processor.process(rehydrated).css

  return css
}

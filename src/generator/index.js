import postcss from "postcss";
import globalTokens from '../design-system/global-tokens.js';

const rootTemplate = () => ({
  "type": "root",
  "nodes": []
})

const ruleTemplate = ({ selector, prop, declValue: value }) => ({
  "type": "rule",
  selector,
  "raws": {
    "before": "",
    "between": " ",
    "semicolon": true,
    "after": " "
  },
  "nodes": [
    declarationTemplate({prop, value})
  ]
})

const declarationTemplate = ({prop, value}) => (    {
  "raws": {
    "before": " ",
    "between": ": "
  },
  "type": "decl",
  prop,
  value,
})

// Convert the object representation of the design system into a JSON AST that postcss understands
const root = rootTemplate()

Object.entries(globalTokens).forEach(([prop, values]) => {
  Object.entries(values).forEach(([propValue, declValue]) => {
    
    if(typeof declValue === 'string') {

      const selector = `.${prop}\\:${propValue}`
      
      const rule = ruleTemplate({ 
        selector, // e.g. .padding:100
        prop, // e.g. padding
        declValue, // e.g. 2px
      })  

      root.nodes.push(rule)

    } else if(typeof declValue ==='object') { // TODO: Not great. Should be a recursive function to handle arbitrary depth
      Object.entries(declValue).forEach(([key, value]) => {
        const selector = `.${prop}\\:${propValue}-${key}`
        const rule = ruleTemplate({ 
          selector, // e.g. .padding:100
          prop, // e.g. padding
          declValue: value, // e.g. 2px
        })

        root.nodes.push(rule)
      })
    }

  })
})


const processor = postcss([]);

// Pass the JSON AST to postcss
let rehydrated = postcss.fromJSON(root)

// Render the AST as actual CSS
const output = processor.process(rehydrated).css

console.log(output)

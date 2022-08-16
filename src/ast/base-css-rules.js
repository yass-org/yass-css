import baseCSS from '../rule-definitions/base-css.js';

const ruleTemplate = ({ selector, prop, declValue: value }) => ({
  "type": "rule",
  selector,
  "raws": {
    "before": "\n",
    "between": " ",
    "semicolon": true,
    "after": "\n"
  },
  "nodes": [
    declarationTemplate({prop, value})
  ]
})

const declarationTemplate = ({prop, value}) => ({
  "raws": {
    "before": "\n  ",
    "between": ": "
  },
  "type": "decl",
  prop,
  value,
})


const generate = () => {
  const rules = []
  
  Object.entries(baseCSS).forEach(([prop, values]) => {
    Object.entries(values).forEach(([propValue, declValue]) => {
        const selector = `.${prop}\\:${propValue}`
        
        const rule = ruleTemplate({ 
          selector, // e.g. .padding:100
          prop, // e.g. padding
          declValue, // e.g. 2px
        })  

        rules.push(rule)
    })
  })

  return rules
}


export {
  generate,
}
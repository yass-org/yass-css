import globalTokens from '../rule-definitions/global-tokens.js';

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
  
  Object.entries(globalTokens).forEach(([prop, values]) => {
    Object.entries(values).forEach(([propValue, declValue]) => {
      
      if(typeof declValue === 'string') {

        const selector = `.${prop}\\:${propValue}`
        
        const rule = ruleTemplate({ 
          selector, // e.g. .padding:100
          prop, // e.g. padding
          declValue, // e.g. 2px
        })  

        rules.push(rule)

      } else if(typeof declValue ==='object') { // TODO: Not great. Should be a recursive function to handle arbitrary depth
        Object.entries(declValue).forEach(([key, value]) => {
          const selector = `.${prop}\\:${propValue}-${key}`
          const rule = ruleTemplate({ 
            selector, // e.g. .padding:100
            prop, // e.g. padding
            declValue: value, // e.g. 2px
          })

          rules.push(rule)
        })
      }

    })
  })

  return rules
}


export {
  generate,
}
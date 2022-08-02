import cssProperties from './CSSproperties.json' assert { type: 'json' };
import fs from 'fs'

const processedCSSProperties = {}
const globalValues = [
    'initial',
    'inherit',
    'unset',
    'revert',
    'revert-layer',
]

const statuses = [
    'non-standard',
    // 'experimental', // These seem okay
    'deprecated',
    'not considering',
]

const getValue = (valueObj) => {
    // {
    //     "value": "-webkit-text",
    //     "status": "non-standard"
    // }

    if(statuses?.includes(valueObj.status)) {
        return
    }

    return valueObj.value
}

let values = []
for(const [name, descriptor] of Object.entries(cssProperties.properties)) {        
    if(!descriptor.values) {
        continue
    }
    values = []
    descriptor.values.forEach((value) => {
        if(typeof value === 'string') {
            values.push(value)
        } else if(typeof value === 'object') {
            values.push(getValue(value))
        }
    })
    
    processedCSSProperties[name] = [
        ...globalValues,
        ...values,
    ]
}

/**
 * Once you run this, the json file will need to be manually converted to a JS file (add an `export default` at the top)
 */
fs.writeFile('../css/properties.json', JSON.stringify(processedCSSProperties, null, 2), err => {
    if (err) {
      console.error(err);
    }
    console.log('success')
  });

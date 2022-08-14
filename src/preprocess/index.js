import cssProperties from './css-properties.json' assert { type: 'json' };
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

const getValidValue = (valueObj) => {
    // {
    //     "value": "-webkit-text",
    //     "status": "non-standard"
    // }

    if(statuses?.includes(valueObj.status)) {
        return [false, null]
    }

    return [true, valueObj.value]
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
            const [isValid, validValue] = getValidValue(value)
            if(isValid) {
                values.push(validValue)
            }
        }
    })

    processedCSSProperties[name] = [
        ...globalValues,
        ...values,
    ]
}

const output = `export default ${JSON.stringify(processedCSSProperties, null, 2)}`
fs.writeFile('./src/preprocess/output.js', output, err => {
    if (err) {
      console.error(err);
    }
    console.log('Rules successfully written to ./output.js')
  });

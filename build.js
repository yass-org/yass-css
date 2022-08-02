import baseCSSProperties from './css/properties.js'
import yargs from 'yargs'
import { hideBin }  from 'yargs/helpers'
import fs from 'fs'

const argv = yargs(hideBin(process.argv)).argv

const customDesignSystem = argv['design-system']

if(customDesignSystem) {
    // TODO: Implement this
    console.log('--design-system: Not yet implemented')    
}

let compiledCSS = ''

// Construct Base CSS Rules
for(const [name, values] of Object.entries(baseCSSProperties)) {
    values.forEach((value) => {
        const rule = `.${name}\:${value} { ${name}:${value}; }`
        compiledCSS = `${compiledCSS}\n${rule}`
    })
}


fs.writeFile('./build/index.css', compiledCSS, err => {
    if (err) {
      console.error(err);
    }
    console.log('success')
});


import baseCSSProperties from './preprocess/output.js'
import { generate } from './generator/index.js'

import yargs from 'yargs'
import { hideBin }  from 'yargs/helpers'
import fs from 'fs'


const initialize = () => {
    // Parse command line args
    const argv = yargs(hideBin(process.argv)).argv

    const customGlobalTokens = argv['global-tokens']
    const customAliasTokens = argv['alias-tokens']
    
    if(customGlobalTokens) {
        // TODO: Implement this
        console.log('--global-tokens: Not yet implemented')    
    }

    if(customAliasTokens) {
        // TODO: Implement this
        console.log('--alias-tokens: Not yet implemented')    
    }
    
}

const build = () => {
    let generatedCSS = generate({
        definitions: [
            baseCSSProperties,
        ]
    })
    
    fs.writeFile('./build/index.css', generatedCSS, err => {
        if (err) {
        console.error(err);
        throw err;
        }
        console.log('success')
    });
}

// export const objToCss = (obj) => {
//     // Construct Base CSS Rules
//     for(const [name, values] of Object.entries(baseCSSProperties)) {
//         values.forEach((value) => {
//             const rule = `.${name}\:${value} { ${name}:${value}; }`
//             compiledCSS = `${compiledCSS}\n${rule}`
//         })
//     }
// }


const main = () => {
    initialize()
    build()
}


main()

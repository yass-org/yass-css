import { generate } from './ast/index.js'
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

const run = () => {

    const css = generate()
    
    fs.writeFile('./build/index.css', css, err => {
        if (err) {
        console.error(err);
        throw err;
        }
        console.log('success')
    });
}


(() => {
    initialize()
    run()
})()

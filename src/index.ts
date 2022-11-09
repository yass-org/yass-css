import build from './build'
import yargs from 'yargs'
import { hideBin }  from 'yargs/helpers'
import fs from 'fs'


const initialize = () => {
    // Parse command line args
    const argv = yargs(hideBin(process.argv)).argv
}

const run = () => {

    const css = build()
    
    fs.writeFile('./build/styles.css', css, err => {
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

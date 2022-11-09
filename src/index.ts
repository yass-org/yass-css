import build from './build'
import yargs from 'yargs'
import { hideBin }  from 'yargs/helpers'
import fs from 'fs'


const initialize = () => {
    // Parse command line args
    const argv = yargs(hideBin(process.argv)).argv
}

const run = () => {

    const { css, json } = build()
    
    fs.writeFile('./build/styles.css', css, err => {
        if (err) {
        console.error(err);
        throw err;
        }
        console.log('Successfully wrote CSS')
    });

    fs.writeFile('./build/styles.json', JSON.stringify(json, null, 2), err => {
        if (err) {
        console.error(err);
        throw err;
        }
        console.log('Successfully wrote JSON')
    });    
}


(() => {
    initialize()
    run()
})()

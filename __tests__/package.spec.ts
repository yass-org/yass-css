// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../package.json')
import fs from 'fs'

describe('package.json', () => {
  it('"main" field is correct', () => {
    // "main" field is the entrypoint for using `yass-css` programmatically
    // it allows `import yass from 'yass-css'`
    const expected = './build/index.js'

    expect(packageJSON.main).toBe(expected)
    expect(fs.existsSync(expected)).toBe(true)
  })

  describe('bin', ()=> {
    it('"yass-css" field is correct', () => {
      // "bin['yass-css']" field is the entrypoint for running `yass-css` in CLI
      // it allows `npx yass-css`
      const expected = './build/build.js'

      expect(packageJSON.bin['yass-css']).toBe(expected)
      expect(fs.existsSync(expected)).toBe(true)
    })
  })

  it('"files" field is correct', () => {
    // "files" allows the build directory to be uploaded to NPM
    // without needing to be tracked in Git. It's necessary for `npx yass-css`
    const expected = [
      'build/*'
    ]

    expect(packageJSON.files).toEqual(expected)
  })
})
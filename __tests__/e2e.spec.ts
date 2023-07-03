import fs from 'fs'
import path from 'path'
import spawn from 'spawndamnit'

describe('yass', () => {
  beforeAll(async () => {
    const { stdout }  = await spawn('ls', ['-al'], { cwd: __dirname.replace('__tests__', '') })
    console.log('stdout', stdout.toString())

    await spawn('npm', ['install', '--location=global'], { cwd: __dirname.replace('__tests__', '') })
  })

  it('works as expected with default config',  async () => {
    const cwd = path.join(__dirname, 'fixtures/projects/1-no-config')

    await spawn('npx', ['yass-css'], { cwd })

    await expect(fs.existsSync(path.join(cwd, '/styles/yass/yass.css'))).toBe(true)

    await spawn('rm', ['-rf', path.join(cwd, 'styles')], { cwd })
  })
})

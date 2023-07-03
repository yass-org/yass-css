import fs from 'fs'
import path from 'path'
import spawn from 'spawndamnit'

describe('yass', () => {
  it('works as expected with default config',  async () => {
    const cwd = path.join(__dirname, 'fixtures/projects/1-no-config')

    await spawn('npx', ['yass-css'], { cwd })
    const child = spawn('ls', ['-al'], { cwd })
    const { stdout, stderr } = await child
    console.log('stdout', stdout.toString())
    console.log('stderr', stderr.toString())

    await expect(fs.existsSync(path.join(cwd, '/styles/yass/yass.css'))).toBe(true)

    await spawn('rm', ['-rf', path.join(cwd, 'styles')], { cwd })
  })
})

import color from './default/color.json'
import elevation from './default/elevation.json'
import fontSize from './default/font-size.json'
import fontWeight from './default/font-weight.json'
import lineHeight from './default/line-height.json'
import opacity from './default/opacity.json'
import scale from './default/scale.json'
import { FileSystem } from '../file-system'

const defaults = [
  ...color,
  ...elevation,
  ...fontSize,
  ...fontWeight,
  ...lineHeight,
  ...opacity,
  ...scale,
]

export const getTokens = (dir: string | undefined) => {
  if(!dir) {
    return defaults
  }

  const tokens = []
  FileSystem.walkDir(dir, (filepath) => {
    tokens.push(...require(`${process.cwd()}/${filepath}`))
  })
  // TODO: Probably validate tokens here
  return tokens
}

import color from './default/color.json'
import elevation from './default/elevation.json'
import fontWeight from './default/font-weight.json'
import opacity from './default/opacity.json'
import scale from './default/scale.json'
import { FileSystem } from '../file-system'

const defaults = [
  ...color,
  ...elevation,
  ...fontWeight,
  ...opacity,
  ...scale,
]

export const getTokens = (dir: string | undefined) => {
  if(!dir) {
    return defaults
  } 

  const tokens = []
  FileSystem.walkDir(dir, (filepath, _stats) => {
    tokens.push(...require(`${process.cwd()}/${filepath}`))
  })

  return tokens
} 

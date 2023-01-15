import color from './default/color.json'
import elevation from './default/elevation.json'
import fontWeight from './default/font-weight.json'
import opacity from './default/opacity.json'
import scale from './default/scale.json'
import css from './css.json'

import walkSync from '../utils/walk-sync'

import type { Config } from '../config'

const defaults = [
  ...color,
  ...elevation,
  ...fontWeight,
  ...opacity,
  ...scale,
]

export const getTokens = (dir: string | undefined, config: Config) => {
  if(!dir) {
    if(config.includeBaseClasses) {
      return [ ...css, ...defaults ]
    }

    return defaults
  }


  let tokens = []

  walkSync(dir, (filepath, stats) => {
    tokens.push(...require(`${process.cwd()}/${filepath}`))
  })

  return tokens
} 

#!/usr/bin/env node
import { build } from './build'
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { UserConfig } from './config'


const tokensDir = process.argv[2]
const userConfig: UserConfig = require(`${process.cwd()}/yass.config.json`) // Open user config JSON

const config = getConfig(userConfig)
const tokens = getTokens(tokensDir, config)
const stylesheet = build(tokens, config)

FileSystem.writeFile(
  config.stylesheet.buildPath,
  config.stylesheet.filename,
  stylesheet,
)

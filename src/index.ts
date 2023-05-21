#!/usr/bin/env node
import { build } from './build'
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { Config } from './config'


const tokensDir = process.argv[2]

const userConfig: Partial<Config> = FileSystem.getIfExists(`${process.cwd()}/yass.config.json`)

const config = getConfig(userConfig)
const tokens = getTokens(tokensDir)
const stylesheet = build(tokens, config)

FileSystem.writeFile(
  config.stylesheet.buildPath,
  config.stylesheet.filename,
  stylesheet,
)

console.log('Success!')

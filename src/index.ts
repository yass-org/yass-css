#!/usr/bin/env node
import { build } from './build'
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { Config } from './config'
import { JitCompiler } from './jit'


const tokensDir = process.argv[2]

const userConfig: Partial<Config> = FileSystem.getIfExists(`${process.cwd()}/yass.config.json`)

const config = getConfig(userConfig)
const tokens = getTokens(tokensDir)
const { buildPath, filename } = config.stylesheet
const { src } = config

if(src) {
  const stylesheet = JitCompiler.build({tokens, config})
  FileSystem.writeFile(buildPath, filename, stylesheet)

} else {

  const stylesheet = build({ tokens, config })
  FileSystem.writeFile(buildPath, filename, stylesheet)
}



console.log('Success!')

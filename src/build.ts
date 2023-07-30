#!/usr/bin/env node
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { Config, UserConfig } from './config'
import { JitCompiler } from './compiler'


const tokensDir = process.argv[2]

const userConfig = FileSystem.getIfExists(`${process.cwd()}/yass.config.json`) as UserConfig

const config: Config = getConfig(userConfig)
const tokens = getTokens(tokensDir)
const { buildPath, filename } = config.stylesheet

const stylesheet = JitCompiler.compile({ tokens, config })

FileSystem.writeFile(buildPath, filename, stylesheet)

console.log('Success!')

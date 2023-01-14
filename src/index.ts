#!/usr/bin/env node
import { build } from './build'
import writeStylesheet from './utils/write-stylesheet'
import getConfig from './config'
import getTokens  from './tokens'


const tokensDir = process.argv[2]

const config = getConfig()
const tokens = getTokens(tokensDir, config)
const stylesheet = build(tokens, config)

writeStylesheet(stylesheet, config)

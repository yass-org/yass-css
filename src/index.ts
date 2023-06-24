#!/usr/bin/env node
import { build } from './build'
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { Config } from './config'


const tokensDir = process.argv[2]

const userConfig: Partial<Config> = FileSystem.getIfExists(`${process.cwd()}/yass.config.json`)

const config = getConfig(userConfig)
const tokens = getTokens(tokensDir)
const { buildPath, filename } = config.stylesheet
const { src } = config
const sourceSet = src ? FileSystem.sourceToSet(src, { ignore: [`${buildPath}/${filename}`]}) : undefined

const stylesheet = build({ tokens, sourceSet, config })

FileSystem.writeFile(buildPath, filename, stylesheet)

console.log('Success!')

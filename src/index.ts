#!/usr/bin/env node
import { FileSystem } from './file-system'
import { getTokens }  from './tokens'
import { getConfig } from './config'

import type { Config } from './config'
import { JitCompiler, DefaultCompiler } from './compilers'


const tokensDir = process.argv[2]

const userConfig: Partial<Config> = FileSystem.getIfExists(`${process.cwd()}/yass.config.json`)

const config = getConfig(userConfig)
const tokens = getTokens(tokensDir)
const { buildPath, filename } = config.stylesheet
const { src } = config
const Compiler = src ? JitCompiler : DefaultCompiler

const stylesheet = Compiler.build({tokens, config})

FileSystem.writeFile(buildPath, filename, stylesheet)

console.log('Success!')

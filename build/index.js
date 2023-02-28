#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./build");
const file_system_1 = require("./file-system");
const tokens_1 = require("./tokens");
const config_1 = require("./config");
const tokensDir = process.argv[2];
const userConfig = file_system_1.FileSystem.readJSONFile(`${process.cwd()}/yass.config.json`, () => console.info('yass.config.json was not found. Using defaults'));
const config = (0, config_1.getConfig)(userConfig);
const tokens = (0, tokens_1.getTokens)(tokensDir, config);
const stylesheet = (0, build_1.build)(tokens, config);
file_system_1.FileSystem.writeFile(config.stylesheet.buildPath, config.stylesheet.filename, stylesheet);

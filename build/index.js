#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./build");
const file_system_1 = require("./file-system");
const tokens_1 = require("./tokens");
const config_1 = require("./config");
const tokensDir = process.argv[2];
const userConfig = file_system_1.FileSystem.getIfExists(`${process.cwd()}/yass.config.json`);
const config = (0, config_1.getConfig)(userConfig);
const tokens = (0, tokens_1.getTokens)(tokensDir);
const { src } = config;
const { buildPath, filename } = config.stylesheet;
const directoryContent = src
    ? file_system_1.FileSystem.readDirectory(src, { ignore: [`${buildPath}/${filename}`] })
    : undefined;
const stylesheet = (0, build_1.build)(tokens, directoryContent, config);
file_system_1.FileSystem.writeFile(buildPath, filename, stylesheet);
console.log('Success!');

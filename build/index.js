#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./build");
const write_stylesheet_1 = __importDefault(require("./utils/write-stylesheet"));
const config_1 = __importDefault(require("./config"));
const tokens_1 = __importDefault(require("./tokens"));
const tokensDir = process.argv[2];
const config = (0, config_1.default)();
const tokens = (0, tokens_1.default)(tokensDir, config);
const stylesheet = (0, build_1.build)(tokens, config);
(0, write_stylesheet_1.default)(stylesheet, config);

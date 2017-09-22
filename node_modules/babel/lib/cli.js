#!/usr/bin/env node
"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalMessage = _path2.default.dirname(process.execPath) === _path2.default.dirname(process.env._ || "") ? " -g" : "";

console.error("You have mistakenly installed the `babel` package, which is a no-op in Babel 6.\n" + "Babel's CLI commands have been moved from the `babel` package to the `babel-cli` package.\n" + "\n" + "    npm uninstall" + globalMessage + " babel\n" + "    npm install --save-dev babel-cli\n" + "\n" + "See http://babeljs.io/docs/usage/cli/ for setup instructions.");
process.exit(1);
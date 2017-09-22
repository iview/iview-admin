#!/usr/bin/env node

var path = require("path");
var program = require("commander");
var Promise = require("bluebird");

var editorconfig = require("../editorconfig");
var package = require("../package.json");

program.version("EditorConfig Node.js Core Version " + package.version);

program
  .usage([
      "[OPTIONS] FILEPATH1 [FILEPATH2 FILEPATH3 ...]",
      program._version,
      "FILEPATH can be a hyphen (-) if you want path(s) to be read from stdin."
    ].join("\n\n  "))
  .option("-f <path>",     "Specify conf filename other than \".editorconfig\"")
  .option("-b <version>",  "Specify version (used by devs to test compatibility)")
  .option("-v, --version", "Display version information")
  .parse(process.argv);

// Throw away the native -V flag in lieu of the one we've manually specified
// to adhere to testing requirements
program.options.shift();

var files = program.args;

if (!files.length) {
  program.help();
}

Promise.map(files, function(filePath) {
  return editorconfig.parse(filePath, {config: program.F, version: program.B});
}).each(function(parsed, i, length) {
  if (length > 1) {
    console.log("[%s]", files[i]);
  }
  Object.keys(parsed).forEach(function(key) {
    console.log(key + "=" + parsed[key]);
  });
});

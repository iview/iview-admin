#!/usr/bin/env node
/**
 * html-minifier CLI tool
 *
 * The MIT License (MIT)
 *
 *  Copyright (c) 2014-2015 Zoltan Frombach
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of
 *  this software and associated documentation files (the "Software"), to deal in
 *  the Software without restriction, including without limitation the rights to
 *  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 *  the Software, and to permit persons to whom the Software is furnished to do so,
 *  subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 *  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 *  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 *  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/* globals JSON:true */

'use strict';

var cli = require('cli');
var concat = require('concat-stream');
var changeCase = require('change-case');
var path = require('path');
var fs = require('fs');
var appName = require('./package.json').name;
var appVersion = require('./package.json').version;
var minify = require('./dist/htmlminifier.min.js').minify;
var HTMLLint = require('./dist/htmlminifier.min.js').HTMLLint;
var minifyOptions = {};
var input = null;
var output = null;

cli.width = 100;
cli.option_width = 40;
cli.setApp(appName, appVersion);

var usage = appName + ' [OPTIONS] [FILE(s)]\n\n';
usage += '  If no input file(s) specified then STDIN will be used for input.\n';
usage += '  If more than one input file specified those will be concatenated and minified together.\n\n';
usage += '  When you specify a config file with the --config-file option (see sample-cli-config-file.conf for format)\n';
usage += '    you can still override some of its contents by providing individual command line options, too.\n\n';
usage += '  When you want to provide an array of strings for --ignore-custom-comments or --process-scripts options\n';
usage += '    on the command line you must escape those such as --ignore-custom-comments "[\\"string1\\",\\"string1\\"]"\n';

cli.setUsage(usage);

var mainOptions = {
  removeComments: [[false, 'Strip HTML comments']],
  removeCommentsFromCDATA: [[false, 'Strip HTML comments from scripts and styles']],
  removeCDATASectionsFromCDATA: [[false, 'Remove CDATA sections from script and style elements']],
  collapseWhitespace: [[false, 'Collapse white space that contributes to text nodes in a document tree.']],
  conservativeCollapse: [[false, 'Always collapse to 1 space (never remove it entirely)']],
  preserveLineBreaks: [[false, 'Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break.']],
  collapseBooleanAttributes: [[false, 'Omit attribute values from boolean attributes']],
  removeAttributeQuotes: [[false, 'Remove quotes around attributes when possible.']],
  removeRedundantAttributes: [[false, 'Remove attributes when value matches default.']],
  preventAttributesEscaping: [[false, 'Prevents the escaping of the values of attributes.']],
  useShortDoctype: [[false, 'Replaces the doctype with the short (HTML5) doctype']],
  removeEmptyAttributes: [[false, 'Remove all attributes with whitespace-only values']],
  removeScriptTypeAttributes: [[false, 'Remove type="text/javascript" from script tags. Other type attribute values are left intact.']],
  removeStyleLinkTypeAttributes: [[false, 'Remove type="text/css" from style and link tags. Other type attribute values are left intact.']],
  removeOptionalTags: [[false, 'Remove unrequired tags']],
  removeIgnored: [[false, 'Remove all tags starting and ending with <%, %>, <?, ?>']],
  removeEmptyElements: [[false, 'Remove all elements with empty contents']],
  lint: [[false, 'Toggle linting']],
  keepClosingSlash: [[false, 'Keep the trailing slash on singleton elements']],
  caseSensitive: [[false, 'Treat attributes in case sensitive manner (useful for SVG; e.g. viewBox)']],
  minifyJS: [[false, 'Minify Javascript in script elements and on* attributes (uses UglifyJS)']],
  minifyCSS: [[false, 'Minify CSS in style elements and style attributes (uses clean-css)']],
  minifyURLs: [[false, 'Minify URLs in various attributes (uses relateurl)']],
  ignoreCustomComments: [[false, 'Array of regex\'es that allow to ignore certain comments, when matched', 'string'], 'json'],
  processScripts: [[false, 'Array of strings corresponding to types of script elements to process through minifier (e.g. "text/ng-template", "text/x-handlebars-template", etc.)', 'string'], 'json'],
  maxLineLength: [[false, 'Max line length', 'number'], true],
  customAttrAssign: [[false, 'Arrays of regex\'es that allow to support custom attribute assign expressions (e.g. \'<div flex?="{{mode != cover}}"></div>\')', 'string'], 'json'],
  customAttrSurround: [[false, 'Arrays of regex\'es that allow to support custom attribute surround expressions (e.g. <input {{#if value}}checked="checked"{{/if}}>)', 'string'], 'json'],
  customAttrCollapse: [[false, 'Regex that specifies custom attribute to strip newlines from (e.g. /ng\-class/)', 'string'], true]
};

var cliOptions = {
  version: ['v', 'Version information'],
  output: ['o', 'Specify output file (if not specified STDOUT will be used for output)', 'file'],
  'config-file': ['c', 'Use config file', 'file']
};

var mainOptionKeys = Object.keys(mainOptions);
mainOptionKeys.forEach(function(key) {
  cliOptions[changeCase.paramCase(key)] = mainOptions[key][0];
});

cli.parse(cliOptions);

cli.main(function(args, options) {

  function parseJSONOption(value) {
    if (value !== null) {
      var jsonArray;
      try {
        jsonArray = JSON.parse(value);
      }
      catch (e) {}
      if (jsonArray instanceof Array) {
        return jsonArray;
      }
      else {
        return [value];
      }
    }
  }

  function runMinify(original) {
    var status = 0;
    var minified = null;
    try {
      minified = minify(original, minifyOptions);
    }
    catch (e) {
      status = 3;
      process.stderr.write('Error: Minification error');
    }

    if (minifyOptions.lint) {
      minifyOptions.lint.populate();
    }

    if (minified !== null) {
      // Write the output
      try {
        if (output !== null) {
          fs.writeFileSync(path.resolve(output), minified);
        }
        else {
          process.stdout.write(minified);
        }
      }
      catch (e) {
        status = 4;
        process.stderr.write('Error: Cannot write to output');
      }
    }

    cli.exit(status);
  }

  if (options.version) {
    process.stderr.write(appName + ' v' + appVersion);
    cli.exit(0);
  }

  if (options['config-file']) {
    try {
      var fileOptions = JSON.parse(fs.readFileSync(path.resolve(options['config-file']), 'utf8'));
      if ((fileOptions !== null) && (typeof fileOptions === 'object')) {
        minifyOptions = fileOptions;
      }
    }
    catch (e) {
      process.stderr.write('Error: Cannot read the specified config file');
      cli.exit(1);
    }
  }

  mainOptionKeys.forEach(function(key) {
    var paramKey = changeCase.paramCase(key);
    var value = options[paramKey];
    if (options[paramKey] !== null) {
      switch (mainOptions[key][1]) {
        case 'json':
          minifyOptions[key] = parseJSONOption(value);
          break;
        case true:
          minifyOptions[key] = value;
          break;
        default:
          minifyOptions[key] = true;
      }
    }
  });

  if (minifyOptions.lint === true) {
    minifyOptions.lint = new HTMLLint();
  }

  if (args.length) {
    input = args;
  }

  if (options.output) {
    output = options.output;
  }

  if (input !== null) { // Minifying one or more files specified on the CMD line

    var original = '';

    input.forEach(function(afile) {
      try {
        original += fs.readFileSync(afile, 'utf8');
      }
      catch (e) {
        process.stderr.write('Error: Cannot read file ' + afile);
        cli.exit(2);
      }
    });

    runMinify(original);

  }
  else { // Minifying input coming from STDIN
    process.stdin.pipe(concat({ encoding: 'string' }, runMinify));
  }

});

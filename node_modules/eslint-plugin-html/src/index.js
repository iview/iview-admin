"use strict";

var path = require("path");
var extract = require("./extract");

var htmlExtensions = [
  ".erb",
  ".handlebars",
  ".hbs",
  ".htm",
  ".html",
  ".mustache",
  ".nunjucks",
  ".php",
  ".tag",
  ".twig",
  ".vue",
  ".we",
];

var xmlExtensions = [
  ".xhtml",
  ".xml",
];

// Disclaimer:
//
// This is not a long term viable solution. ESLint needs to improve its processor API to
// provide access to the configuration before actually preprocess files, but it's not
// planed yet. This solution is quite ugly but shouldn't alter eslint process.
//
// Related github issues:
// https://github.com/eslint/eslint/issues/3422
// https://github.com/eslint/eslint/issues/4153

function findESLintModules() {
  var modules = [];
  var needle = path.join("lib", "eslint.js");
  for (var key in require.cache) {
    if (key.indexOf(needle, key.length - needle.length) >= 0) {
      var eslint = require(key);
      if (typeof eslint.verify === "function") {
        modules.push(eslint);
      }
    }
  }

  if (!modules.length) {
    throw new Error("eslint-plugin-html error: It seems that eslint is not loaded. " +
                    "If you think it is a bug, please file a report at " +
                    "https://github.com/BenoitZugmeyer/eslint-plugin-html/issues");
  }

  return modules;
}

function createProcessor(defaultXMLMode) {
  var patchedModules = null;
  var originalVerifyMethods = new WeakMap();
  var reportBadIndent;

  var currentInfos;

  function patchModule(module) {
    var originalVerify = module.verify;

    function patchedVerify(textOrSourceCode, config, filenameOrOptions, saveState) {
      var indentDescriptor = config.settings && config.settings["html/indent"];
      var xmlMode = config.settings && config.settings["html/xml-mode"];
      reportBadIndent = config.settings && config.settings["html/report-bad-indent"];

      if (typeof xmlMode !== "boolean") {
        xmlMode = defaultXMLMode;
      }

      currentInfos = extract(textOrSourceCode, {
        indent: indentDescriptor,
        reportBadIndent: Boolean(reportBadIndent),
        xmlMode: xmlMode,
      });

      return originalVerify.call(this, currentInfos.code, config, filenameOrOptions, saveState);
    }

    originalVerifyMethods.set(module, originalVerify);

    module.verify = patchedVerify;
  }

  function unpatchModule(module) {
    var originalVerify = originalVerifyMethods.get(module);
    if (originalVerify) {
      module.verify = originalVerify;
    }
  }

  return {

    preprocess: function (content) {
      patchedModules = findESLintModules();
      patchedModules.forEach(patchModule);

      return [content];
    },

    postprocess: function (messages) {
      patchedModules.forEach(unpatchModule);
      patchedModules = null;

      messages[0].forEach(function (message) {
        message.column += currentInfos.map[message.line] || 0;
      });

      currentInfos.badIndentationLines.forEach(function (line) {
        messages[0].push({
          message: "Bad line indentation.",
          line: line,
          column: 1,
          ruleId: "(html plugin)",
          severity: reportBadIndent === true ? 2 : reportBadIndent,
        });
      });

      messages[0].sort(function (ma, mb) {
        return ma.line - mb.line || ma.column - mb.column;
      });

      return messages[0];
    },

  };

}

var htmlProcessor = createProcessor(false);
var xmlProcessor = createProcessor(true);

var processors = {};

htmlExtensions.forEach(function(ext) {
  processors[ext] = htmlProcessor;
});

xmlExtensions.forEach(function(ext) {
  processors[ext] = xmlProcessor;
});

exports.processors = processors;

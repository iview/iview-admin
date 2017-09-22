'use strict';

var yaml = require('js-yaml');
var requireFromString = require('require-from-string');
var readFile = require('./readFile');
var parseJson = require('./parseJson');

module.exports = function (filepath, options) {
  return loadExtensionlessRc().then(function (result) {
    if (result) return result;
    if (options.rcExtensions) return loadRcWithExtensions();
    return null;
  });

  function loadExtensionlessRc() {
    return readRcFile().then(function (content) {
      if (!content) return null;

      var pasedConfig = (options.rcStrictJson)
        ? parseJson(content, filepath)
        : yaml.safeLoad(content, {
          filename: filepath,
        });
      return {
        config: pasedConfig,
        filepath: filepath,
      };
    });
  }

  function loadRcWithExtensions() {
    return readRcFile('json').then(function (content) {
      if (content) {
        var successFilepath = filepath + '.json';
        return {
          config: parseJson(content, successFilepath),
          filepath: successFilepath,
        };
      }
      // If not content was found in the file with extension,
      // try the next possible extension
      return readRcFile('yaml');
    }).then(function (content) {
      if (content) {
        // If the previous check returned an object with a config
        // property, then it succeeded and this step can be skipped
        if (content.config) return content;
        // If it just returned a string, then *this* check succeeded
        var successFilepath = filepath + '.yaml';
        return {
          config: yaml.safeLoad(content, { filename: successFilepath }),
          filepath: successFilepath,
        };
      }
      return readRcFile('yml');
    }).then(function (content) {
      if (content) {
        if (content.config) return content;
        var successFilepath = filepath + '.yml';
        return {
          config: yaml.safeLoad(content, { filename: successFilepath }),
          filepath: successFilepath,
        };
      }
      return readRcFile('js');
    }).then(function (content) {
      if (content) {
        if (content.config) return content;
        var successFilepath = filepath + '.js';
        return {
          config: requireFromString(content, successFilepath),
          filepath: successFilepath,
        };
      }
      return null;
    });
  }

  function readRcFile(extension) {
    var filepathWithExtension = (extension)
      ? filepath + '.' + extension
      : filepath;
    return readFile(filepathWithExtension);
  }
};

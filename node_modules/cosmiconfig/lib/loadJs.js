'use strict';

var requireFromString = require('require-from-string');
var readFile = require('./readFile');

module.exports = function (filepath) {
  return readFile(filepath).then(function (content) {
    if (!content) return null;

    return {
      config: requireFromString(content, filepath),
      filepath: filepath,
    };
  });
};

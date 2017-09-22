'use strict';

var path = require('path');
var readFile = require('./readFile');
var parseJson = require('./parseJson');

module.exports = function (packageDir, options) {
  var packagePath = path.join(packageDir, 'package.json');

  return readFile(packagePath).then(function (content) {
    if (!content) return null;
    var parsedContent = parseJson(content, packagePath);
    var packagePropValue = parsedContent[options.packageProp];
    if (!packagePropValue) return null;

    return {
      config: packagePropValue,
      filepath: packagePath,
    };
  });
};

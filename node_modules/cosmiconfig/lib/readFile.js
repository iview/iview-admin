'use strict';

var fs = require('fs');

module.exports = function (filepath, options) {
  options = options || {};
  options.throwNotFound = options.throwNotFound || false;

  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, content) {
      if (err && err.code === 'ENOENT' && !options.throwNotFound) {
        return resolve(null);
      }

      if (err) return reject(err);

      resolve(content);
    });
  });
};

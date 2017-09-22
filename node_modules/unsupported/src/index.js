/*jshint node:true */

'use strict';

var isUndefined = require('lodash.isundefined');
var UNSUPPORTED_ERROR_TEXT = 'Unsupported operation';

module.exports = function unsupportedFactory(customMessage) {
  var message = isUndefined(customMessage) ? UNSUPPORTED_ERROR_TEXT : customMessage;

  return function unsupported() {
    throw new Error(message);
  };
};

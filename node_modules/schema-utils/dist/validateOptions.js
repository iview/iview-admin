'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _ValidationError = require('./ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

var validateOptions = function validateOptions(schema, options, name) {
  var ajv = new _ajv2.default({
    useDefaults: true,
    allErrors: true,
    errorDataPath: 'property'
  });

  if (typeof schema === 'string') {
    schema = _fs2.default.readFileSync(_path2.default.resolve(schema), 'utf8'); // eslint-disable-line
    schema = JSON.parse(schema); // eslint-disable-line
  }

  if (!ajv.validate(schema, options)) {
    throw new _ValidationError2.default(ajv.errors, name);
  }

  return true;
};

exports.default = validateOptions;
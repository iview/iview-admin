/*jshint node:true, mocha:true */

'use strict';

require('should');

var unsupportedFactory = require('../src/');

describe('unsupported operation', function() {
  it('should throw', function() {
    var unsupported = unsupportedFactory();

    (function() {
      unsupported();
    }).should.throw();
  });

  it('should support custom errors', function() {
    var unsupported = unsupportedFactory('custom error 123');

    (function() {
      unsupported();
    }).should.throw('custom error 123');
  });
});

"use strict";

exports.__esModule = true;
exports.clear = clear;
exports.clearPath = clearPath;
exports.clearScope = clearScope;
var path = exports.path = new WeakMap();
var scope = exports.scope = new WeakMap();

function clear() {
  clearPath();
  clearScope();
}

function clearPath() {
  exports.path = path = new WeakMap();
}

function clearScope() {
  exports.scope = scope = new WeakMap();
}
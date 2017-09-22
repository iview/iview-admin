// this is a utility loader that takes a *.vue file, parses it and returns
// the requested language block, e.g. the content inside <template>, for
// further processing.

var path = require('path')
var parse = require('./parser')
var loaderUtils = require('loader-utils')

module.exports = function (content) {
  this.cacheable()
  var query = loaderUtils.getOptions(this) || {}
  var filename = path.basename(this.resourcePath)
  var parts = parse(content, filename, this.sourceMap)
  var part = parts[query.type]
  if (Array.isArray(part)) {
    part = part[query.index]
  }
  this.callback(null, part.content, part.map)
}

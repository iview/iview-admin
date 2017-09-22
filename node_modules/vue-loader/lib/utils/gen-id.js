// utility for generating a uid for each component file
// used in scoped CSS rewriting
var path = require('path')
var hash = require('hash-sum')
var cache = Object.create(null)
var sepRE = new RegExp(path.sep.replace('\\', '\\\\'), 'g')

module.exports = function genId (file, context, key) {
  var contextPath = context.split(path.sep)
  var rootId = contextPath[contextPath.length - 1]
  file = rootId + '/' + path.relative(context, file).replace(sepRE, '/') + (key || '')
  return cache[file] || (cache[file] = hash(file))
}

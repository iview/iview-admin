// loader for pre-processing templates with e.g. pug

var cons = require('consolidate')
var loaderUtils = require('loader-utils')
var extname = require('path').extname

module.exports = function (content) {
  this.cacheable && this.cacheable()
  var callback = this.async()
  var opt = loaderUtils.getOptions(this) || {}

  // this is never documented and should be deprecated
  // but we'll keep it so we don't break stuff
  var vue = this.options.__vueOptions__
  if (vue && vue.template) {
    for (var key in vue.template) {
      opt[key] = vue.template[key]
    }
  }

  function exportContent (content) {
    if (opt.raw) {
      callback(null, content)
    } else {
      callback(null, 'module.exports = ' + JSON.stringify(content))
    }
  }

  // with no engine given, use the file extension as engine
  if (!opt.engine) {
    opt.engine = extname(this.request).substr(1).toLowerCase()
  }

  if (!cons[opt.engine]) {
    return callback(new Error(
      'Template engine \'' + opt.engine + '\' ' +
      'isn\'t available in Consolidate.js'
    ))
  }

  // for relative includes
  opt.filename = this.resourcePath

  cons[opt.engine].render(content, opt, function (err, html) {
    if (err) {
      return callback(err)
    }
    exportContent(html)
  })
}

var loaderUtils = require('loader-utils')
var normalize = require('../utils/normalize')
var compiler = require('vue-template-compiler')
var beautify = require('js-beautify').js_beautify
var transpile = require('vue-template-es2015-compiler')
var hotReloadAPIPath = normalize.dep('vue-hot-reload-api')
var transformRequire = require('./modules/transform-require')

module.exports = function (html) {
  this.cacheable()
  var isServer = this.target === 'node'
  var isProduction = this.minimize || process.env.NODE_ENV === 'production'
  var vueOptions = this.options.__vueOptions__ || {}
  var options = loaderUtils.getOptions(this) || {}

  var defaultModules = [transformRequire(options.transformToRequire)]
  var userModules = vueOptions.compilerModules || options.compilerModules
  // for HappyPack cross-process use cases
  if (typeof userModules === 'string') {
    userModules = require(userModules)
  }

  var compilerOptions = {
    preserveWhitespace: options.preserveWhitespace,
    modules: defaultModules.concat(userModules || [])
  }

  var compiled = compiler.compile(html, compilerOptions)

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      this.emitWarning(tip)
    })
  }

  var code
  if (compiled.errors && compiled.errors.length) {
    this.emitError(
      `\n  Error compiling template:\n${pad(html)}\n` +
      compiled.errors.map(e => `  - ${e}`).join('\n') + '\n'
    )
    code = 'module.exports={render:function(){},staticRenderFns:[]}'
  } else {
    var bubleOptions = options.buble
    code = transpile('module.exports={' +
      'render:' + toFunction(compiled.render) + ',' +
      'staticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + ']' +
    '}', bubleOptions)
    // mark with stripped (this enables Vue to use correct runtime proxy detection)
    if (!isProduction && (
      !bubleOptions ||
      !bubleOptions.transforms ||
      bubleOptions.transforms.stripWith !== false
    )) {
      code += `\nmodule.exports.render._withStripped = true`
    }
  }
  // hot-reload
  if (!isServer && !isProduction) {
    code +=
      '\nif (module.hot) {\n' +
      '  module.hot.accept()\n' +
      '  if (module.hot.data) {\n' +
      '     require("' + hotReloadAPIPath + '").rerender("' + options.id + '", module.exports)\n' +
      '  }\n' +
      '}'
  }

  return code
}

function toFunction (code) {
  return 'function (){' + beautify(code, {
    indent_size: 2 // eslint-disable-line camelcase
  }) + '}'
}

function pad (html) {
  return html.split(/\r?\n/).map(line => `  ${line}`).join('\n')
}

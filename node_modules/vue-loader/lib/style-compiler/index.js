var postcss = require('postcss')
var loaderUtils = require('loader-utils')
var loadPostcssConfig = require('./load-postcss-config')

var trim = require('./plugins/trim')
var scopeId = require('./plugins/scope-id')

module.exports = function (css, map) {
  this.cacheable()
  var cb = this.async()

  var query = loaderUtils.getOptions(this) || {}
  var vueOptions = this.options.__vueOptions__

  if (!vueOptions) {
    if (query.hasInlineConfig) {
      this.emitError(
        `\n  [vue-loader] It seems you are using HappyPack with inline postcss ` +
        `options for vue-loader. This is not supported because loaders running ` +
        `in different threads cannot share non-serializable options. ` +
        `It is recommended to use a postcss config file instead.\n` +
        `\n  See http://vue-loader.vuejs.org/en/features/postcss.html#using-a-config-file for more details.\n`
      )
    }
    vueOptions = Object.assign({}, this.options.vue, this.vue)
  }

  // use the same config loading interface as postcss-loader
  loadPostcssConfig(vueOptions.postcss).then(config => {
    var plugins = [trim].concat(config.plugins)
    var options = Object.assign({
      to: this.resourcePath,
      from: this.resourcePath,
      map: false
    }, config.options)

    // add plugin for vue-loader scoped css rewrite
    if (query.scoped) {
      plugins.push(scopeId({ id: query.id }))
    }

    // source map
    if (
      this.sourceMap &&
      !this.minimize &&
      vueOptions.cssSourceMap !== false &&
      process.env.NODE_ENV !== 'production' &&
      !options.map
    ) {
      options.map = {
        inline: false,
        annotation: false,
        prev: map
      }
    }

    return postcss(plugins)
      .process(css, options)
      .then(function (result) {
        var map = result.map && result.map.toJSON()
        cb(null, result.css, map)
        return null // silence bluebird warning
      })
  }).catch(e => {
    console.log(e)
    cb(e)
  })
}

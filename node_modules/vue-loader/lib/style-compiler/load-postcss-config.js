var load = require('postcss-load-config')

var loaded

function isObject (val) {
  return val && typeof val === 'object'
}

module.exports = function loadPostcssConfig (inlineConfig) {
  if (process.env.VUE_LOADER_TEST || !loaded) {
    loaded = load({}, null, { argv: false }).catch(() => {
      // postcss-load-config throws error when no config file is found,
      // but for us it's optional.
    })
  }

  return loaded.then(config => {
    var plugins = []
    var options = {}

    // inline postcss options for vue-loader
    if (typeof inlineConfig === 'function') {
      inlineConfig = inlineConfig.call(this, this)
    }
    if (Array.isArray(inlineConfig)) {
      plugins = inlineConfig
    } else if (isObject(inlineConfig)) {
      plugins = inlineConfig.plugins || []
      options = inlineConfig.options || {}
    }

    // merge postcss config file
    if (config && config.plugins) {
      plugins = plugins.concat(config.plugins)
    }
    if (config && config.options) {
      options = Object.assign({}, config.options, options)
    }

    return {
      plugins,
      options
    }
  })
}

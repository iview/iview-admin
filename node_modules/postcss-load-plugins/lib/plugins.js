// ------------------------------------
// # POSTCSS - LOAD PLUGINS - PLUGINS
// ------------------------------------

'use strict'

/**
 * @method plugins
 *
 * @param {Object} config PostCSS Config
 *
 * @return {Array} plugins PostCSS Plugins
 */
module.exports = function plugins (config) {
  var plugins = []

  if (Array.isArray(config.plugins)) {
    plugins = config.plugins.filter(Boolean)

    if (plugins.length && plugins.length > 0) {
      plugins.forEach(function (plugin, i) {
        if (!plugin) throw new Error('Loading PostCSS Plugin failed')

        if (plugin.postcss) plugin = plugin.postcss

        if (plugin.default) plugin = plugin.default

        if (
          !(typeof plugin === 'object' && Array.isArray(plugin.plugins) ||
          typeof plugin === 'function')
        ) {
          throw new TypeError('Invalid PostCSS Plugin found: ' + '[' + i + ']')
        }
      })
    }

    return plugins
  } else {
    config = config.plugins

    var load = function (plugin, options) {
      if (options === null || Object.keys(options).length === 0) {
        try {
          return require(plugin)
        } catch (err) {
          err.message = 'Loading PostCSS Plugin failed: ' + err.message

          throw err
        }
      } else {
        try {
          return require(plugin)(options)
        } catch (err) {
          err.message = 'Loading PostCSS Plugin failed: ' + err.message

          throw err
        }
      }
    }

    Object.keys(config)
      .filter(function (plugin) {
        return config[plugin] !== false ? plugin : ''
      })
      .forEach(function (plugin, i) {
        plugin = load(plugin, config[plugin])

        if (plugin.postcss) plugin = plugin.postcss

        if (plugin.default) plugin = plugin.default

        if (
          !(typeof plugin === 'object' && Array.isArray(plugin.plugins) ||
          typeof plugin === 'function')
        ) {
          throw new TypeError('Invalid PostCSS Plugin found: ' + '[' + i + ']')
        }

        return plugins.push(plugin)
      })

    return plugins
  }
}

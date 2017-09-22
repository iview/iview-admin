var postcss = require('postcss')

module.exports = postcss.plugin('trim', function (opts) {
  return function (css) {
    css.walk(function (node) {
      if (node.type === 'rule' || node.type === 'atrule') {
        node.raws.before = node.raws.after = '\n'
      }
    })
  }
})

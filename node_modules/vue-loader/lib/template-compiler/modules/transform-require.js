// vue compiler module for transforming `<tag>:<attribute>` to `require`

var defaultOptions = {
  img: 'src',
  image: 'xlink:href'
}

module.exports = userOptions => {
  var options = userOptions
    ? Object.assign({}, defaultOptions, userOptions)
    : defaultOptions

  return {
    postTransformNode: node => {
      transform(node, options)
    }
  }
}

function transform (node, options) {
  for (var tag in options) {
    if (node.tag === tag && node.attrs) {
      var attributes = options[tag]
      if (typeof attributes === 'string') {
        node.attrs.some(attr => rewrite(attr, attributes))
      } else if (Array.isArray(attributes)) {
        attributes.forEach(item => node.attrs.some(attr => rewrite(attr, item)))
      }
    }
  }
}

function rewrite (attr, name) {
  if (attr.name === name) {
    var value = attr.value
    var isStatic = value.charAt(0) === '"' && value.charAt(value.length - 1) === '"'
    if (!isStatic) {
      return
    }
    var firstChar = value.charAt(1)
    if (firstChar === '.' || firstChar === '~') {
      if (firstChar === '~') {
        value = '"' + value.slice(2)
      }
      attr.value = `require(${value})`
    }
    return true
  }
}

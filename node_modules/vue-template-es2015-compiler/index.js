var buble = require('./buble')

// selectively support some handy ES2015 features in templates.
var options = {
  transforms: {
    modules: false,
    stripWith: true // this is a custom feature for stripping with from Vue render functions.
  }
}

module.exports = function transpile (code, opts) {
  if (opts) {
    opts = Object.assign({}, options, opts)
    opts.transforms = Object.assign({}, options.transforms, opts.transforms)
  } else {
    opts = options
  }
  var code = buble.transform(code, opts).code
  // console.log(code)
  return code
}

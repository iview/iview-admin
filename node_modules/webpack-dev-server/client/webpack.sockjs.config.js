'use strict';

// eslint-disable-next-line
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  output: {
    library: 'SockJS',
    libraryTarget: 'umd'
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};

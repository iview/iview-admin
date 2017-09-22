'use strict';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          'pug-loader?self'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin()
  ]
};

HTML Webpack Plugin
===================
[![npm version](https://badge.fury.io/js/html-webpack-plugin.svg)](http://badge.fury.io/js/html-webpack-plugin) [![Dependency Status](https://david-dm.org/jantimon/html-webpack-plugin.svg)](https://david-dm.org/jantimon/html-webpack-plugin) [![Build status](https://travis-ci.org/jantimon/html-webpack-plugin.svg)](https://travis-ci.org/jantimon/html-webpack-plugin) [![Windows build status](https://ci.appveyor.com/api/projects/status/github/jantimon/html-webpack-plugin?svg=true&branch=master)](https://ci.appveyor.com/project/jantimon/html-webpack-plugin) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard) [![bitHound Dependencies](https://www.bithound.io/github/jantimon/html-webpack-plugin/badges/dependencies.svg)](https://www.bithound.io/github/jantimon/html-webpack-plugin/master/dependencies/npm) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

[![NPM](https://nodei.co/npm/html-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/html-webpack-plugin/)

This is a [webpack](http://webpack.github.io/) plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include
a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you, supply
your own template using lodash templates or use your own loader.

Maintainer: Jan Nicklas [@jantimon](https://twitter.com/jantimon) and Thomas Sileghem [@mastilver](https://twitter.com/mastilver)

Installation
------------
Install the plugin with npm:
```shell
$ npm install html-webpack-plugin --save-dev
```

Third party addons:
-------------

The html-webpack-plugin provides [hooks](https://github.com/jantimon/html-webpack-plugin#events) to extend it to your needs.
There are already some really powerful plugins which can be integrated with zero configuration:

 * [webpack-subresource-integrity](https://www.npmjs.com/package/webpack-subresource-integrity) for enhanced asset security
 * [appcache-webpack-plugin](https://github.com/lettertwo/appcache-webpack-plugin) for iOS and Android offline usage
 * [favicons-webpack-plugin](https://github.com/jantimon/favicons-webpack-plugin) which generates favicons and icons for iOS, Android and desktop browsers
 * [html-webpack-harddisk-plugin](https://github.com/jantimon/html-webpack-harddisk-plugin) can be used to always write to disk the html file, useful when webpack-dev-server / HMR are being used
 * [html-webpack-inline-source-plugin](https://github.com/DustinJackson/html-webpack-inline-source-plugin) to inline your assets in the resulting HTML file
 * [html-webpack-exclude-assets-plugin](https://github.com/jamesjieye/html-webpack-exclude-assets-plugin) for excluding assets using regular expressions
 * [html-webpack-include-assets-plugin](https://github.com/jharris4/html-webpack-include-assets-plugin) for including lists of js or css file paths (such as those copied by the copy-webpack-plugin).
 * [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) to add `async`, `defer` or `module` attributes to your`<script>` elements, or even in-line them
 * [style-ext-html-webpack-plugin](https://github.com/numical/style-ext-html-webpack-plugin) to convert your `<link>`s to external stylesheets into `<style>` elements containing internal CSS
 * [resource-hints-webpack-plugin](https://github.com/jantimon/resource-hints-webpack-plugin) to add resource hints for faster initial page loads using `<link rel='preload'>` and `<link rel='prefetch'>`
 * [preload-webpack-plugin](https://github.com/GoogleChrome/preload-webpack-plugin) for automatically wiring up asynchronous (and other types) of JavaScript chunks using `<link rel='preload'>` helping with lazy-loading
 * [link-media-html-webpack-plugin](https://github.com/yaycmyk/link-media-html-webpack-plugin) allows for injected stylesheet `<link />` tags to have their media attribute set automatically; useful for providing specific desktop/mobile/print etc. stylesheets that the browser will conditionally download
 * [inline-chunk-manifest-html-webpack-plugin](https://github.com/jouni-kantola/inline-chunk-manifest-html-webpack-plugin) for inlining webpack's chunk manifest. Default extracts manifest and inlines in `<head>`.

Basic Usage
-----------

The plugin will generate an HTML5 file for you that includes all your webpack
bundles in the body using `script` tags. Just add the plugin to your webpack
config as follows:

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

This will generate a file `dist/index.html` containing the following:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

If you have multiple webpack entry points, they will all be included with `script`
tags in the generated HTML.

If you have any CSS assets in webpack's output (for example, CSS extracted
with the [ExtractTextPlugin](https://github.com/webpack/extract-text-webpack-plugin))
then these will be included with `<link>` tags in the HTML head.

Configuration
-------------
You can pass a hash of configuration options to `HtmlWebpackPlugin`.
Allowed values are as follows:

- `title`: The title to use for the generated HTML document.
- `filename`: The file to write the HTML to. Defaults to `index.html`.
   You can specify a subdirectory here too (eg: `assets/admin.html`).
- `template`: Webpack require path to the template. Please see the [docs](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md) for details.
- `inject`: `true | 'head' | 'body' | false` Inject all assets into the given `template` or `templateContent` - When passing `true` or `'body'` all javascript resources will be placed at the bottom of the body element. `'head'` will place the scripts in the head element.
- `favicon`: Adds the given favicon path to the output html.
- `minify`: `{...} | false` Pass [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)'s options as object to minify the output.
- `hash`: `true | false` if `true` then append a unique webpack compilation hash to all
  included scripts and CSS files. This is useful for cache busting.
- `cache`: `true | false` if `true` (default) try to emit the file only if it was changed.
- `showErrors`: `true | false` if `true` (default) errors details will be written into the HTML page.
- `chunks`: Allows you to add only some chunks (e.g. only the unit-test chunk)
- `chunksSortMode`: Allows to control how chunks should be sorted before they are included to the html. Allowed values: 'none' | 'auto' | 'dependency' |'manual' | {function} - default: 'auto'
- `excludeChunks`: Allows you to skip some chunks (e.g. don't add the unit-test chunk)
- `xhtml`: `true | false` If `true` render the `link` tags as self-closing, XHTML compliant. Default is `false`

Here's an example webpack config illustrating how to use these options:
```javascript
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'assets/admin.html'
    })
  ]
}
```

FAQ
----

* [Why is my HTML minified?](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)
* [Why is my `<% ... %>` template not working?](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)
* [How can I use handlebars/pug/ejs as template engine](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)

Generating Multiple HTML Files
------------------------------
To generate more than one HTML file, declare the plugin more than
once in your plugins array:
```javascript
{
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(), // Generates default index.html
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/assets/test.html'
    })
  ]
}
```

Writing Your Own Templates
--------------------------
If the default generated HTML doesn't meet your needs you can supply
your own template. The easiest way is to use the `template` option and pass a custom HTML file.
The html-webpack-plugin will automatically inject all necessary CSS, JS, manifest
and favicon files into the markup.

```javascript
plugins: [
  new HtmlWebpackPlugin({
    title: 'Custom template',
    template: 'my-index.ejs', // Load a custom template (ejs by default see the FAQ for details)
  })
]
```

`my-index.ejs`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
  </body>
</html>
```

If you already have a template loader, you can use it to parse the template.
Please note that this will also happen if you specifiy the html-loader and use `.html` file as template.

```javascript
module: {
  loaders: [
    { test: /\.hbs$/, loader: "handlebars" }
  ]
},
plugins: [
  new HtmlWebpackPlugin({
    title: 'Custom template using Handlebars',
    template: 'my-index.hbs'
  })
]
```

You can use the lodash syntax out of the box.
If the `inject` feature doesn't fit your needs and you want full control over the asset placement use the [default template](https://github.com/jaketrent/html-webpack-template/blob/86f285d5c790a6c15263f5cc50fd666d51f974fd/index.html) of the [html-webpack-template project](https://github.com/jaketrent/html-webpack-template) as a starting point for writing your own.

The following variables are available in the template:
- `htmlWebpackPlugin`: data specific to this plugin
  - `htmlWebpackPlugin.files`: a massaged representation of the
    `assetsByChunkName` attribute of webpack's [stats](https://github.com/webpack/docs/wiki/node.js-api#stats)
    object. It contains a mapping from entry point name to the bundle filename, eg:
    ```json
    "htmlWebpackPlugin": {
      "files": {
        "css": [ "main.css" ],
        "js": [ "assets/head_bundle.js", "assets/main_bundle.js"],
        "chunks": {
          "head": {
            "entry": "assets/head_bundle.js",
            "css": [ "main.css" ]
          },
          "main": {
            "entry": "assets/main_bundle.js",
            "css": []
          },
        }
      }
    }
    ```
    If you've set a publicPath in your webpack config this will be reflected
    correctly in this assets hash.

  - `htmlWebpackPlugin.options`: the options hash that was passed to
     the plugin. In addition to the options actually used by this plugin,
     you can use this hash to pass arbitrary data through to your template.

- `webpack`: the webpack [stats](https://github.com/webpack/docs/wiki/node.js-api#stats)
  object. Note that this is the stats object as it was at the time the HTML template
  was emitted and as such may not have the full set of stats that are available
  after the webpack run is complete.

- `webpackConfig`: the webpack configuration that was used for this compilation. This
  can be used, for example, to get the `publicPath` (`webpackConfig.output.publicPath`).


Filtering chunks
----------------

To include only certain chunks you can limit the chunks being used:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    chunks: ['app']
  })
]
```

It is also possible to exclude certain chunks by setting the `excludeChunks` option:

```javascript
plugins: [
  new HtmlWebpackPlugin({
    excludeChunks: ['dev-helper']
  })
]
```

Events
------

To allow other [plugins](https://github.com/webpack/docs/wiki/plugins) to alter the HTML this plugin executes the following events:

Async:

 * `html-webpack-plugin-before-html-generation`
 * `html-webpack-plugin-before-html-processing`
 * `html-webpack-plugin-alter-asset-tags`
 * `html-webpack-plugin-after-html-processing`
 * `html-webpack-plugin-after-emit`

Sync:

 * `html-webpack-plugin-alter-chunks`

Example implementation: [html-webpack-harddisk-plugin](https://github.com/jantimon/html-webpack-harddisk-plugin)

Usage:

```javascript
// MyPlugin.js

function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function(compiler) {
  // ...
  compiler.plugin('compilation', function(compilation) {
    console.log('The compiler is starting a new compilation...');

    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
      htmlPluginData.html += 'The magic footer';
      callback(null, htmlPluginData);
    });
  });

};

module.exports = MyPlugin;
```
Then in `webpack.config.js`

```javascript
plugins: [
  new MyPlugin({options: ''})
]
```

Note that the callback must be passed the htmlPluginData in order to pass this onto any other plugins listening on the same `html-webpack-plugin-before-html-processing` event.


# Contribution

You're free to contribute to this project by submitting [issues](https://github.com/jantimon/html-webpack-plugin/issues) and/or [pull requests](https://github.com/jantimon/html-webpack-plugin/pulls). This project is test-driven, so keep in mind that every change and new feature should be covered by tests.
This project uses the [semistandard code style](https://github.com/Flet/semistandard).

Before running the tests, make sure to execute `yarn link` and `yarn link html-webpack-plugin` (or the npm variant of this).

# License

This project is licensed under [MIT](https://github.com/jantimon/html-webpack-plugin/blob/master/LICENSE).

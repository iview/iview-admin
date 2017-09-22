# vue-html-loader

> This is a fork of [html-loader](https://github.com/webpack/html-loader) with some modifications for handling Vue templates.

## Config

You can config the loader's behavior by adding an `html` field under `vue` in your webpack config:

``` js
// webpack.config.js
module.exports = {
  // ...
  vue: {
    html: {
      // all loader queries can be specified here
      // also, you can specify options for htmlMinifier here.
    }
  }
}
```

## Original README below

Exports HTML as string. HTML is minimized when the compiler demands.

By default every local `<img src="image.png">` is required (`require("./image.png")`). You may need to specify loaders for images in your configuration (recommended `file-loader` or `url-loader`).

You can specify which tag-attribute combination should be processed by this loader via the query parameter `attrs`. Pass an array or a space-separated list of `<tag>:<attribute>` combinations. (Default: `attrs=img:src`)

To completely disable tag-attribute processing (for instance, if you're handling image loading on the client side) you can pass in `attrs=false`.

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## Examples

With this configuration:

``` javascript
{
	module: { loaders: [
		{ test: /\.jpg$/, loader: "file-loader" },
		{ test: /\.png$/, loader: "url-loader?mimetype=image/png" }
	]},
	output: {
		publicPath: "http://cdn.example.com/[hash]/"
	}
}
```

``` html
<!-- fileA.html -->
<img  src="image.jpg"  data-src="image2x.png" >
```

``` javascript
require("html!./fileA.html");
// => '<img  src="http://cdn.example.com/49e...ba9f/a9f...92ca.jpg"  data-src="image2x.png" >'

require("html?attrs=img:data-src!./file.html");
// => '<img  src="image.png"  data-src="data:image/png;base64,..." >'

require("html?attrs=img:src img:data-src!./file.html");
require("html?attrs[]=img:src&attrs[]=img:data-src!./file.html");
// => '<img  src="http://cdn.example.com/49e...ba9f/a9f...92ca.jpg"  data-src="data:image/png;base64,..." >'

require("html?-attrs!./file.html");
// => '<img  src="image.jpg"  data-src="image2x.png" >'

/// minimized by running `webpack --optimize-minimize`
// => '<img src=http://cdn.example.com/49e...ba9f/a9f...92ca.jpg data-src=data:image/png;base64,...>'

```

## 'Root-relative' urls

For urls that start with a `/`, the default behavior is to not translate them.
If a `root` query parameter is set, however, it will be prepended to the url
and then translated.

With the same configuration above:
``` html
<!-- fileB.html -->
<img src="/image.jpg">
```

``` javascript

require("html!./fileB.html");
// => '<img  src="/image.jpg">'

require("html?root=.!./fileB.html");
// => '<img  src="http://cdn.example.com/49e...ba9f/a9f...92ca.jpg">'

```

## Interpolation

You can use `interpolate` flag to enable interpolation syntax for ES6 template strings, like so:

```
require("html?interpolate!./file.html");
```

```
<img src="${require(`./images/gallery.png`)}" />
<div>${require('./partials/gallery.html')}</div>
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

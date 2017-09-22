[![NPM version](https://img.shields.io/npm/v/html-minifier.svg?style=flat)](https://www.npmjs.com/package/html-minifier)
[![Build Status](https://img.shields.io/travis/kangax/html-minifier.svg?style=flat)](https://travis-ci.org/kangax/html-minifier)
[![Dependency Status](https://img.shields.io/david/kangax/html-minifier.svg?style=flat)](https://david-dm.org/kangax/html-minifier)
[![devDependency Status](https://img.shields.io/david/dev/kangax/html-minifier.svg?style=flat)](https://david-dm.org/kangax/html-minifier#info=devDependencies)

[HTMLMinifier](http://kangax.github.io/html-minifier/) is a highly **configurable**, **well-tested**, Javascript-based HTML minifier, with lint-like capabilities.

See [corresponding blog post](http://perfectionkills.com/experimenting-with-html-minifier/) for all the gory details of [how it works](http://perfectionkills.com/experimenting-with-html-minifier/#how_it_works), [description of each option](http://perfectionkills.com/experimenting-with-html-minifier/#options), [testing results](http://perfectionkills.com/experimenting-with-html-minifier/#field_testing) and [conclusions](http://perfectionkills.com/experimenting-with-html-minifier/#cost_and_benefits).

[Test suite is available online](http://kangax.github.io/html-minifier/tests/).

Also see corresponding [Ruby wrapper](https://github.com/stereobooster/html_minifier), and for Node.js, [Grunt plugin](https://github.com/gruntjs/grunt-contrib-htmlmin), [Gulp module](https://github.com/jonschlinkert/gulp-htmlmin), and [Koa middleware wrapper](https://github.com/koajs/html-minifier).

How does HTMLMinifier compare to [another solution](http://www.willpeavy.com/minifier/) — HTML Minifier from Will Peavy (1st result in [google search for "html minifier"](https://www.google.com/#q=html+minifier)) as well as htmlcompressor.com?

| Site | Original size _(KB)_ | HTMLMinifier _(KB)_ | Will Peavy _(KB)_ | htmlcompressor.com _(KB)_ |
| --------------------------------------------------------------------------- |:-----------:| ----------------:| ------------:| ----------------:|
| [HTMLMinifier page](https://github.com/kangax/html-minifier)                | 48.8        | <b>37.3</b>      |   43.3       | 41.9 |
| [ES6 table](http://kangax.github.io/es5-compat-table/es6/)                  | 117.9       | <b>79.9</b>      |   92         | 91.9 |
| [MSN](http://msn.com)                                                       | 156.6       | <b>133</b>       |   145        | 138.3 |
| [Stackoverflow](http://stackoverflow.com)                                   | 200.4       | <b>159.5</b>     |   168.3      | 163.3 |
| [Amazon](http://amazon.com)                                                 | 245.9       | <b>206.3</b>     |   225        | 218.5 |
| [Wikipedia](http://en.wikipedia.org/wiki/President_of_the_United_States)    | 401.4       | <b>380.6</b>     |   396.3      | n/a |
| [Eloquent Javascript](http://eloquentjavascript.net/print.html)             | 869.5       | <b>830</b>       |   872        | n/a |



## Options Quick Reference

| Option                         | Description     | Default |
|--------------------------------|-----------------|---------|
| `removeComments`               | [Strip HTML comments](http://perfectionkills.com/experimenting-with-html-minifier/#remove_comments) | `false` |
| `removeCommentsFromCDATA`      | [Strip HTML comments from scripts and styles](http://perfectionkills.com/experimenting-with-html-minifier/#remove_comments_from_scripts_and_styles) | `false` |
| `removeCDATASectionsFromCDATA` | [Remove CDATA sections from script and style elements](http://perfectionkills.com/experimenting-with-html-minifier/#remove_cdata_sections) | `false` |
| `collapseWhitespace`           | [Collapse white space that contributes to text nodes in a document tree.](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_whitespace) | `false` |
| `conservativeCollapse`         | Always collapse to 1 space (never remove it entirely). Must be used in conjunction with `collapseWhitespace=true` | `false` |
| `preserveLineBreaks`           | Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break. Must be used in conjunction with `collapseWhitespace=true` | `false` |
| `collapseBooleanAttributes`    | [Omit attribute values from boolean attributes](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_boolean_attributes) | `false` |
| `removeAttributeQuotes`        | [Remove quotes around attributes when possible.](http://perfectionkills.com/experimenting-with-html-minifier/#remove_attribute_quotes) | `false` |
| `removeRedundantAttributes`    | [Remove attributes when value matches default.](http://perfectionkills.com/experimenting-with-html-minifier/#remove_redundant_attributes) | `false` |
| `preventAttributesEscaping`    | Prevents the escaping of the values of attributes. | `false` |
| `useShortDoctype`              | [Replaces the doctype with the short (HTML5) doctype](http://perfectionkills.com/experimenting-with-html-minifier/#use_short_doctype) | `false` |
| `removeEmptyAttributes`        | [Remove all attributes with whitespace-only values](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_or_blank_attributes) | `false` |
| `removeScriptTypeAttributes`   | Remove `type="text/javascript"` from `script` tags. Other `type` attribute values are left intact. | `false` |
| `removeStyleLinkTypeAttributes`| Remove `type="text/css"` from `style` and `link` tags. Other `type` attribute values are left intact. | `false` |
| `removeOptionalTags`           | [Remove unrequired tags](http://perfectionkills.com/experimenting-with-html-minifier/#remove_optional_tags) | `false` |
| `removeIgnored`                | Remove all tags starting and ending with `<%`, `%>`, `<?`, `?>` | `false` |
| `removeEmptyElements`          | [Remove all elements with empty contents](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_elements) | `false` |
| `lint`                         | [Toggle linting](http://perfectionkills.com/experimenting-with-html-minifier/#validate_input_through_html_lint) | `false` |
| `keepClosingSlash`             | Keep the trailing slash on singleton elements                            | `false` |
| `caseSensitive`                | Treat attributes in case sensitive manner (useful for custom HTML tags.) | `false` |
| `minifyJS`                     | Minify Javascript in script elements and on* attributes (uses [UglifyJS](https://github.com/mishoo/UglifyJS2)) | `false` (could be `true`, `false`, `Object` (options)) |
| `minifyCSS`                    | Minify CSS in style elements and style attributes (uses [clean-css](https://github.com/GoalSmashers/clean-css)) | `false` (could be `true`, `false`, `Object` (options)) |
| `minifyURLs`                   | Minify URLs in various attributes (uses [relateurl](https://github.com/stevenvachon/relateurl)) | `false` (could be `Object` (options)) |
| `ignoreCustomComments`         | Array of regex'es that allow to ignore certain comments, when matched  | `[ ]` |
| `processScripts`               | Array of strings corresponding to types of script elements to process through minifier (e.g. `text/ng-template`, `text/x-handlebars-template`, etc.) | `[ ]` |
| `maxLineLength`                | Specify a maximum line length. Compressed output will be split by newlines at valid HTML split-points. |
| `customAttrAssign`             | Arrays of regex'es that allow to support custom attribute assign expressions (e.g. `'<div flex?="{{mode != cover}}"></div>'`) | `[ ]` |
| `customAttrSurround`           | Arrays of regex'es that allow to support custom attribute surround expressions (e.g. `<input {{#if value}}checked="checked"{{/if}}>`) | `[ ]` |
| `customAttrCollapse`           | Regex that specifies custom attribute to strip newlines from (e.g. `/ng\-class/`) | |

## Special cases

### Ignoring chunks of markup.

If you have chunks of markup you would like preserved, you can wrap them `<!-- htmlmin:ignore -->`.

### Preserving SVG tags

SVG tags are automatically recognized, and when they are minified, both case-sensitivity and closing-slashes are preserved, regardless of the minification settings used for the rest of the file.

## Installation Instructions

From NPM for use as a command line app:
```bash
npm install html-minifier -g
```

From NPM for programmatic use:
```bash
npm install html-minifier
```

From Git:
```bash
git clone git://github.com/kangax/html-minifier.git
cd html-minifier
npm link .
```

## Usage

For command line usage please see `html-minifier --help`

### Node.js

```js
var minify = require('html-minifier').minify;
var result = minify('<p title="blah" id="moo">foo</p>', {
  removeAttributeQuotes: true
});
result; // '<p title=blah id=moo>foo</p>'
```

## Running benchmarks

Benchmarks for minified HTML:
```
node benchmark.js
```

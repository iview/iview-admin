## [0.7.0](https://github.com/kangax/html-minifier/compare/v0.6.9...v0.7.0)

* TODO

## [0.6.9](https://github.com/kangax/html-minifier/compare/v0.6.8...v0.6.9)

* TODO

## [0.6.8](https://github.com/kangax/html-minifier/compare/v0.6.7...v0.6.8)

* TODO

## [0.6.7](https://github.com/kangax/html-minifier/compare/v0.6.6...v0.6.7)

* Preserve empty script with `src` attribute
* Make `draggable` enumerated attribute
* Add option to preserve a single line break on collapse
* Do not treat draggable as a boolean attribute
* Add `minifyURLs` option
* Add `customAttrCollapse` option
* `collapseBoolean` is case-insensitive
* Remove removable attrs with unspecified values
* `removeComments` affects htmlmin:ignore comments
* Quote terminal attribute value by unary slash
* Closing tag search is case-insensitive
* `s` tag has been reinstated
* Remove `i`, `b`, `u` tags from linter as problematic

## [0.6.6](https://github.com/kangax/html-minifier/compare/v0.6.5...v0.6.6)

* Fix Firefox attribute bug
* Add `customAttrAssign` option
* Add `maxLineLength` option
* Add `customAttrSurround` option

## [0.6.5](https://github.com/kangax/html-minifier/compare/v0.6.4...v0.6.5)

* `caseSensitive` option now applies to tags and attributes

## [0.6.4](https://github.com/kangax/html-minifier/compare/v0.6.3...v0.6.4)

* Support for mixed-case tags
* Support IE downlevel-revealed conditional comments
* Add support for `wbr` element

## [0.6.3](https://github.com/kangax/html-minifier/compare/v0.6.2...v0.6.3)

* Do not treat `translate` attribute as boolean
* Add `svg` element in inline list
* Do not remove special spaces like `&nbsp;`
* Make `collapseWhitespace` more resilient

## [0.6.2](https://github.com/kangax/html-minifier/compare/v0.6.1...v0.6.2)

* Fix bug introduced by `processScripts` option

## [0.6.1](https://github.com/kangax/html-minifier/compare/v0.6.0...v0.6.1)

* Add CLI
* Fix error with valueless attributes (e.g. `<a href>`). [#169](https://github.com/kangax/html-minifier/issues/169)

## [0.6.0](https://github.com/kangax/html-minifier/compare/v0.5.6...v0.6.0)

* Minify meta viewport value [#159](https://github.com/kangax/html-minifier/issues/159)
* Add support for ignoring markup via `<!-- htmlmin:ignore -->` [#89](https://github.com/kangax/html-minifier/issues/89)
* Add support for `processScripts` [#139](https://github.com/kangax/html-minifier/issues/139)
* Add support for `ignoreCustomComments` [#145](https://github.com/kangax/html-minifier/issues/145)
* Add `conservativeCollapse` option
* Fix handling of valueless attributes [#150](https://github.com/kangax/html-minifier/issues/150)
* Escape closing script tag [#142](https://github.com/kangax/html-minifier/issues/142)
* Add support for minifying CSS (`minifyCSS`)
* Add support for minifying JS (`minifyJS`)
* Don't add empty string value to valueless attributes
* Add more boolean attributes
* No more tags in lint output (Node friendly)
* Add more optional tags
* Node.js v0.10 is needed for development

## [0.5.6 / 2014-03-12](https://github.com/kangax/html-minifier/compare/v0.5.5...v0.5.6)

* Add an option to keep closing slash in singleton tags [#76](https://github.com/kangax/html-minifier/issues/76)
* Make `</source>` tag optional [#92](https://github.com/kangax/html-minifier/issues/92)
* Add `td` and `th` to optional tags list [#95](https://github.com/kangax/html-minifier/issues/95)
* Add `caseSensitive` option [#106](https://github.com/kangax/html-minifier/issues/106)
* Add options quick reference in README.md [#131](https://github.com/kangax/html-minifier/issues/131)
* Fix quotes in attributes
* Ignore unneeded files from being included in the npm package
* Switch to Grunt for development

## [0.5.5 / 2014-01-03](https://github.com/kangax/html-minifier/compare/v0.5.4...v0.5.5)

* Add missing inline tags for collapsing whitespace
* Preserve quotes if attribute ends with a trailing slash
* Add space around time tag
* Newlines are collapsed to one space

## [0.5.4 / 2013-09-04](https://github.com/kangax/html-minifier/compare/v0.5.3...v0.5.4)

* Add support for ignoring `<%...%>` and `<?...?>`
* Fix space after `textarea`
* Add support for ignored comments (`<!--!`)
* Add more tags to `collapseWhitespaceSmart` whitelist

## [0.5.3 / 2013-06-19](https://github.com/kangax/html-minifier/compare/v0.5.2...v0.5.3)

* Better support for boolean attributes [#63](https://github.com/kangax/html-minifier/issues/76)
* Make sure `code`, `kbd` and `quote` tags have space around them
* Improve `canRemoveAttributeQuotes`
* Add html5 option (supports custom elements, block elements in inline)

## [0.5.2 / 2013-05-13](https://github.com/kangax/html-minifier/compare/v0.5.1...v0.5.2)

* Fix NPM package

## [0.5.1 / 2013-05-12](https://github.com/kangax/html-minifier/compare/v0.5.0...v0.5.1)

* Menu is no longer deprecated in HTML5 [#23](https://github.com/kangax/html-minifier/issues/23)
* Make parser ignore block elements in inline elements (allowed in HTML5). [#51](https://github.com/kangax/html-minifier/issues/51) [#52](https://github.com/kangax/html-minifier/issues/52) [#54](https://github.com/kangax/html-minifier/issues/54)
* Fix issue with closing tags
* Smarter `collapseWhitespace` (preserve space around inline tags)

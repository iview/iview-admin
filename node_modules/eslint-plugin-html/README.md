eslint-plugin-html
==================

[![Build Status](https://travis-ci.org/BenoitZugmeyer/eslint-plugin-html.svg?branch=master)](https://travis-ci.org/BenoitZugmeyer/eslint-plugin-html)

This [`ESLint`](http://eslint.org) plugin extracts and lints scripts from HTML files.

Supported HTML extensions:

* .erb
* .handlebars
* .hbs
* .htm
* .html
* .mustache
* .nunjucks
* .php
* .tag
* .twig
* .vue
* .we

Supported XHTML extensions:

* .xhtml
* .xml

Only script tags with no type attribute or a type attribute containing a MIME type known to
represent JavaScript such as `text/javascript` or `application/javascript`, or `text/babel` will be
linted.


Usage
-----

Simply install via npm `npm install eslint-plugin-html --save` add the plugin to your ESLint
configuration. See
[ESLint documentation](http://eslint.org/docs/user-guide/configuring#configuring-plugins).

Example:

```javascript
{
    "plugins": [
        "html"
    ]
}
```


Settings
--------

### `html/indent`

By default, the code between `<script>` tags is dedented according to the first non-empty line. The
setting `html/indent` allows to ensure that every script tags follow an uniform indentation. Like
the `indent` rule, you can pass a number of spaces, or `"tab"` to indent with one tab. Prefix this
value with a `+` to be relative to the `<script>` tag indentation. Example:

```javascript
{
    "plugins": [ "html" ],
    "settings": {
        "html/indent": "0",   // code should start at the beginning of the line (no initial indentation).
        "html/indent": "+2",  // indentation is the <script> indentation plus two spaces.
        "html/indent": "tab", // indentation is one tab at the beginning of the line.
    }
}
```


### `html/report-bad-indent`

By default, this plugin won't warn if it encounters a problematic indentation (ex: a line is under
indented). If you want to make sure the indentation is correct, use the `html/report-bad-indent` in
conjunction with the `indent` rule. Pass `1` to display warnings, or `2` to display errors. Example:

```javascript
{
    "plugins": [ "html" ],
    "settings": {
        "html/report-bad-indent": 2,
    }
}
```


### `html/xml-mode`

By default, files with an extension known to be XML (`.xml`, `.xhtml`) will be considered as XML.
This slightly changes the markup parsing, mainly when considering `CDATA` sections:
* in XML, any data inside a `CDATA` section will be considered as raw text (not XML) and the `CDATA`
  delimiter will be droped ;
* in HTML, there is no such thing for `<script>` tags: the `CDATA` delimiter is considered as normal
  text and thus, part of the script.

The setting `html/xml-mode` allows to force all files to be considered as XML (by passing `true`) or
HTML (by passing `false`). Example:

```javascript
{
    "plugins": [ "html" ],
    "settings": {
      "html/xml-mode": true,
    }
}
```

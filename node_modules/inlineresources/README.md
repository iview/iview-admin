inlineresources
===============

<a href="https://www.npmjs.org/package/inlineresources">
    <img src="https://badge.fury.io/js/inlineresources.svg"
         align="right" alt="NPM version" height="18">
</a>

Inlines style sheets, images, fonts and scripts in HTML documents. Works in the browser.

See the [API](https://github.com/cburgmer/inlineresources/wiki/API).

Limitations
-----------

Resources referenced in the document (CSS, images, fonts and JS) can only be loaded if from the [same origin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript), unless techniques like [CORS](http://enable-cors.org) are used.

Yet to be supported:

* Background images in inline style declarations (`<div style="...">`)
* Media queries defined on link elements (`<link rel="stylesheet" media="..." />`)
* Media queries defined on import rules (`@import url("...") screen and (orientation:landscape);`)
* Future responsive img solution (`<img srcset="...">`)

Similar projects for Node.js
----------------------------

* [jasonbellamy/asset-inliner](https://github.com/jasonbellamy/asset-inliner)
* [cdata/collapsify](https://github.com/cdata/collapsify)
* [EE/grunt-inline-images](https://github.com/EE/grunt-inline-images)
* [popeindustries/inline-source](https://github.com/popeindustries/inline-source)
* [LearnBoost/juice](https://github.com/LearnBoost/juice)
* [fb55/node-inline](https://github.com/fb55/node-inline)
* [callumlocke/resource-embedder](https://github.com/callumlocke/resource-embedder)
* [kevva/rework-inline](https://github.com/kevva/rework-inline)
* [andreypopp/xcss-inline-woff](https://github.com/andreypopp/xcss-inline-woff)
* ... and many more

Development
-----------

For linting, tests and a browser build install Node.js and run

    $ ./go

Check `./dist/` for the browserified builds.

To test against several browsers while editing, run `grunt testWatch` and point those browsers to `http://localhost:9989/`.

[![Build Status](https://travis-ci.org/cburgmer/inlineresources.svg?branch=master)](https://travis-ci.org/cburgmer/inlineresources)

Where is it used?
-----------------

* [rasterizeHTML.js](https://github.com/cburgmer/rasterizeHTML.js), Renders HTML into the browser's canvas
* ...

Author
------
Christoph Burgmer. Licensed under MIT. Reach out [on Twitter](https://twitter.com/cburgmer).

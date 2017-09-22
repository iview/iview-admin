rasterizeHTML.js
================

<a href="https://www.npmjs.org/package/rasterizehtml">
    <img src="https://badge.fury.io/js/rasterizehtml.svg"
        align="right" alt="NPM version" height="18">
</a>

Renders HTML into the browser's canvas.

See the [API](https://github.com/cburgmer/rasterizeHTML.js/wiki/API).


Install
-------

    $ npm install rasterizehtml

Then include a script tag with `node_modules/rasterizehtml/dist/rasterizeHTML.allinone.js` or require through [browserify](https://github.com/substack/node-browserify).

Example
-------

```js
var canvas = document.getElementById("canvas");
rasterizeHTML.drawHTML('Some ' +
                       '<span style="color: green; font-size: 20px;">HTML</span>' +
                       ' with an image <img src="someimg.png">',
                       canvas);
```

See [the examples page](https://github.com/cburgmer/rasterizeHTML.js/wiki/Examples). The code also [ships with examples](https://github.com/cburgmer/rasterizeHTML.js/tree/master/examples), make sure to run `npm test` first to compile the library.

How does it work
----------------

For security reasons rendering HTML into a canvas is severly limited. Firefox offers such a function via `ctx.drawWindow()`, but only with Chrome privileges (see https://developer.mozilla.org/en/Drawing_Graphics_with_Canvas).

As described in http://robert.ocallahan.org/2011/11/drawing-dom-content-to-canvas.html and https://developer.mozilla.org/en/HTML/Canvas/Drawing_DOM_objects_into_a_canvas however it is possible by embedding the HTML into an SVG image as a `<foreignObject>` and then drawing the resulting image via `ctx.drawImage()`.

In addition SVG is not allowed to link to external resources and so rasterizeHTML.js will load external images, fonts and stylesheets and store them inline via [data: URIs](http://en.wikipedia.org/wiki/Data_URI_scheme) (or inline style elements respectively).

Limitations
-----------

All resources (HTML page, CSS, images, fonts and JS) that are needed for drawing the page can only be loaded if from the [same origin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript), unless techniques like [CORS](http://enable-cors.org) are used. I.E. `drawURL()` can only load pages from the same domain as the current page and all draw methods can equally only embed styling and images from that domain.

The code is tested under Firefox, Chrome & Safari.

There's basic support for Microsoft Edge, however **it will not work under [any version of Internet Explorer](https://github.com/cburgmer/rasterizeHTML.js/wiki/Limitations#ie).**

Also the individual browsers still have some issues when rendering SVGs with embedded HTML to the canvas.

[The full list of limitations is here](https://github.com/cburgmer/rasterizeHTML.js/wiki/Limitations).

Development
-----------

Run `npm test`. There's also a vagrant image that installs all necessary build dependencies.

For tests against individual browsers open `test/SpecRunner.html`, for integration tests under Safari open `test/manualIntegrationTestForWebkit.html` (under Chrome you will either need to start the browser passing in the option `--allow-file-access-from-files` or load the page through a local webserver).

[![Build Status](https://travis-ci.org/cburgmer/rasterizeHTML.js.svg?branch=master)](https://travis-ci.org/cburgmer/rasterizeHTML.js)

Where is it used?
-----------------

* [CSS Critic](https://github.com/cburgmer/csscritic), a lightweight tool for regression testing of Cascading Style Sheets
* ...

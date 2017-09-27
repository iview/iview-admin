(function () {

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
var register_3795 = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
    target = target[fragments[i]];
  }
  target[fragments[fragments.length - 1]] = module;
};

var instantiate = function (id) {
  var actual = defs[id];
  var dependencies = actual.deps;
  var definition = actual.defn;
  var len = dependencies.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances[i] = dem(dependencies[i]);
  var defResult = definition.apply(null, instances);
  if (defResult === undefined)
     throw 'module [' + id + '] returned undefined';
  actual.instance = defResult;
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var len = ids.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
};

var ephox = {};

ephox.bolt = {
  module: {
    api: {
      define: def,
      require: req,
      demand: dem
    }
  }
};

var define = def;
var require = req;
var demand = dem;
// this helps with minificiation when using a lot of global references
var defineGlobal = function (id, ref) {
  define(id, [], function () { return ref; });
};
/*jsc
["tinymce.plugins.autoresize.Plugin","tinymce.core.dom.DOMUtils","tinymce.core.Env","tinymce.core.PluginManager","tinymce.core.util.Delay","global!tinymce.util.Tools.resolve"]
jsc*/
defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.Env',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.Env');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.PluginManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.PluginManager');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Delay',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Delay');
  }
);

/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the autoresize plugin.
 *
 * @class tinymce.autoresize.Plugin
 * @private
 */
define(
  'tinymce.plugins.autoresize.Plugin',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.core.util.Delay'
  ],
  function (DOMUtils, Env, PluginManager, Delay) {
    var DOM = DOMUtils.DOM;

    PluginManager.add('autoresize', function (editor) {
      var settings = editor.settings, oldSize = 0;

      function isFullscreen() {
        return editor.plugins.fullscreen && editor.plugins.fullscreen.isFullscreen();
      }

      if (editor.settings.inline) {
        return;
      }

      /**
       * This method gets executed each time the editor needs to resize.
       */
      function resize(e) {
        var deltaSize, doc, body, docElm, resizeHeight, myHeight,
          marginTop, marginBottom, paddingTop, paddingBottom, borderTop, borderBottom;

        doc = editor.getDoc();
        if (!doc) {
          return;
        }

        body = doc.body;
        docElm = doc.documentElement;
        resizeHeight = settings.autoresize_min_height;

        if (!body || (e && e.type === "setcontent" && e.initial) || isFullscreen()) {
          if (body && docElm) {
            body.style.overflowY = "auto";
            docElm.style.overflowY = "auto"; // Old IE
          }

          return;
        }

        // Calculate outer height of the body element using CSS styles
        marginTop = editor.dom.getStyle(body, 'margin-top', true);
        marginBottom = editor.dom.getStyle(body, 'margin-bottom', true);
        paddingTop = editor.dom.getStyle(body, 'padding-top', true);
        paddingBottom = editor.dom.getStyle(body, 'padding-bottom', true);
        borderTop = editor.dom.getStyle(body, 'border-top-width', true);
        borderBottom = editor.dom.getStyle(body, 'border-bottom-width', true);
        myHeight = body.offsetHeight + parseInt(marginTop, 10) + parseInt(marginBottom, 10) +
          parseInt(paddingTop, 10) + parseInt(paddingBottom, 10) +
          parseInt(borderTop, 10) + parseInt(borderBottom, 10);

        // Make sure we have a valid height
        if (isNaN(myHeight) || myHeight <= 0) {
          // Get height differently depending on the browser used
          // eslint-disable-next-line no-nested-ternary
          myHeight = Env.ie ? body.scrollHeight : (Env.webkit && body.clientHeight === 0 ? 0 : body.offsetHeight);
        }

        // Don't make it smaller than the minimum height
        if (myHeight > settings.autoresize_min_height) {
          resizeHeight = myHeight;
        }

        // If a maximum height has been defined don't exceed this height
        if (settings.autoresize_max_height && myHeight > settings.autoresize_max_height) {
          resizeHeight = settings.autoresize_max_height;
          body.style.overflowY = "auto";
          docElm.style.overflowY = "auto"; // Old IE
        } else {
          body.style.overflowY = "hidden";
          docElm.style.overflowY = "hidden"; // Old IE
          body.scrollTop = 0;
        }

        // Resize content element
        if (resizeHeight !== oldSize) {
          deltaSize = resizeHeight - oldSize;
          DOM.setStyle(editor.iframeElement, 'height', resizeHeight + 'px');
          oldSize = resizeHeight;

          // WebKit doesn't decrease the size of the body element until the iframe gets resized
          // So we need to continue to resize the iframe down until the size gets fixed
          if (Env.webKit && deltaSize < 0) {
            resize(e);
          }
        }
      }

      /**
       * Calls the resize x times in 100ms intervals. We can't wait for load events since
       * the CSS files might load async.
       */
      function wait(times, interval, callback) {
        Delay.setEditorTimeout(editor, function () {
          resize({});

          if (times--) {
            wait(times, interval, callback);
          } else if (callback) {
            callback();
          }
        }, interval);
      }

      // Define minimum height
      settings.autoresize_min_height = parseInt(editor.getParam('autoresize_min_height', editor.getElement().offsetHeight), 10);

      // Define maximum height
      settings.autoresize_max_height = parseInt(editor.getParam('autoresize_max_height', 0), 10);

      // Add padding at the bottom for better UX
      editor.on("init", function () {
        var overflowPadding, bottomMargin;

        overflowPadding = editor.getParam('autoresize_overflow_padding', 1);
        bottomMargin = editor.getParam('autoresize_bottom_margin', 50);

        if (overflowPadding !== false) {
          editor.dom.setStyles(editor.getBody(), {
            paddingLeft: overflowPadding,
            paddingRight: overflowPadding
          });
        }

        if (bottomMargin !== false) {
          editor.dom.setStyles(editor.getBody(), {
            paddingBottom: bottomMargin
          });
        }
      });

      // Add appropriate listeners for resizing content area
      editor.on("nodechange setcontent keyup FullscreenStateChanged", resize);

      if (editor.getParam('autoresize_on_init', true)) {
        editor.on('init', function () {
          // Hit it 20 times in 100 ms intervals
          wait(20, 100, function () {
            // Hit it 5 times in 1 sec intervals
            wait(5, 1000);
          });
        });
      }

      // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
      editor.addCommand('mceAutoResize', resize);
    });

    return function () {};
  }
);
dem('tinymce.plugins.autoresize.Plugin')();
})();

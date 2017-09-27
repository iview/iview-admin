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
["tinymce.plugins.code.Plugin","tinymce.core.dom.DOMUtils","tinymce.core.PluginManager","global!tinymce.util.Tools.resolve"]
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
  'tinymce.core.PluginManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.PluginManager');
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
 * This class contains all core logic for the code plugin.
 *
 * @class tinymce.code.Plugin
 * @private
 */
define(
  'tinymce.plugins.code.Plugin',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.PluginManager'
  ],
  function (DOMUtils, PluginManager) {
    PluginManager.add('code', function (editor) {
      function showDialog() {
        var win = editor.windowManager.open({
          title: "Source code",
          body: {
            type: 'textbox',
            name: 'code',
            multiline: true,
            minWidth: editor.getParam("code_dialog_width", 600),
            minHeight: editor.getParam("code_dialog_height", Math.min(DOMUtils.DOM.getViewPort().h - 200, 500)),
            spellcheck: false,
            style: 'direction: ltr; text-align: left'
          },
          onSubmit: function (e) {
            // We get a lovely "Wrong document" error in IE 11 if we
            // don't move the focus to the editor before creating an undo
            // transation since it tries to make a bookmark for the current selection
            editor.focus();

            editor.undoManager.transact(function () {
              editor.setContent(e.data.code);
            });

            editor.selection.setCursorLocation();
            editor.nodeChanged();
          }
        });

        // Gecko has a major performance issue with textarea
        // contents so we need to set it when all reflows are done
        win.find('#code').value(editor.getContent({ source_view: true }));
      }

      editor.addCommand("mceCodeEditor", showDialog);

      editor.addButton('code', {
        icon: 'code',
        tooltip: 'Source code',
        onclick: showDialog
      });

      editor.addMenuItem('code', {
        icon: 'code',
        text: 'Source code',
        context: 'tools',
        onclick: showDialog
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.code.Plugin')();
})();

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
["tinymce.plugins.visualblocks.Plugin","tinymce.core.PluginManager","global!tinymce.util.Tools.resolve"]
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
 * @class tinymce.visualblocks.Plugin
 * @private
 */
define(
  'tinymce.plugins.visualblocks.Plugin',
  [
    'tinymce.core.PluginManager'
  ],
  function (PluginManager) {
    PluginManager.add('visualblocks', function (editor, url) {
      var cssId, visualBlocksMenuItem, enabled;

      // We don't support older browsers like IE6/7 and they don't provide prototypes for DOM objects
      if (!window.NodeList) {
        return;
      }

      function toggleActiveState() {
        var self = this;

        self.active(enabled);

        editor.on('VisualBlocks', function () {
          self.active(editor.dom.hasClass(editor.getBody(), 'mce-visualblocks'));
        });
      }

      editor.addCommand('mceVisualBlocks', function () {
        var dom = editor.dom, linkElm;

        if (!cssId) {
          cssId = dom.uniqueId();
          linkElm = dom.create('link', {
            id: cssId,
            rel: 'stylesheet',
            href: url + '/css/visualblocks.css'
          });

          editor.getDoc().getElementsByTagName('head')[0].appendChild(linkElm);
        }

        // Toggle on/off visual blocks while computing previews
        editor.on("PreviewFormats AfterPreviewFormats", function (e) {
          if (enabled) {
            dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type == "afterpreviewformats");
          }
        });

        dom.toggleClass(editor.getBody(), 'mce-visualblocks');
        enabled = editor.dom.hasClass(editor.getBody(), 'mce-visualblocks');

        if (visualBlocksMenuItem) {
          visualBlocksMenuItem.active(dom.hasClass(editor.getBody(), 'mce-visualblocks'));
        }

        editor.fire('VisualBlocks');
      });

      editor.addButton('visualblocks', {
        title: 'Show blocks',
        cmd: 'mceVisualBlocks',
        onPostRender: toggleActiveState
      });

      editor.addMenuItem('visualblocks', {
        text: 'Show blocks',
        cmd: 'mceVisualBlocks',
        onPostRender: toggleActiveState,
        selectable: true,
        context: 'view',
        prependToContext: true
      });

      editor.on('init', function () {
        if (editor.settings.visualblocks_default_state) {
          editor.execCommand('mceVisualBlocks', false, null, { skip_focus: true });
        }
      });

      editor.on('remove', function () {
        editor.dom.removeClass(editor.getBody(), 'mce-visualblocks');
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.visualblocks.Plugin')();
})();

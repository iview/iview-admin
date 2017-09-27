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
["tinymce.plugins.anchor.Plugin","tinymce.core.Env","tinymce.core.PluginManager","global!tinymce.util.Tools.resolve"]
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
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the anchor plugin.
 *
 * @class tinymce.anchor.Plugin
 * @private
 */
define(
  'tinymce.plugins.anchor.Plugin',
  [
    'tinymce.core.Env',
    'tinymce.core.PluginManager'
  ],

  function (Env, PluginManager) {
    PluginManager.add('anchor', function (editor) {
      var isAnchorNode = function (node) {
        return !node.attr('href') && (node.attr('id') || node.attr('name')) && !node.firstChild;
      };

      var setContentEditable = function (state) {
        return function (nodes) {
          for (var i = 0; i < nodes.length; i++) {
            if (isAnchorNode(nodes[i])) {
              nodes[i].attr('contenteditable', state);
            }
          }
        };
      };

      var isValidId = function (id) {
        // Follows HTML4 rules: https://www.w3.org/TR/html401/types.html#type-id
        return /^[A-Za-z][A-Za-z0-9\-:._]*$/.test(id);
      };

      var showDialog = function () {
        var selectedNode = editor.selection.getNode();
        var isAnchor = selectedNode.tagName == 'A' && editor.dom.getAttrib(selectedNode, 'href') === '';
        var value = '';

        if (isAnchor) {
          value = selectedNode.id || selectedNode.name || '';
        }

        editor.windowManager.open({
          title: 'Anchor',
          body: { type: 'textbox', name: 'id', size: 40, label: 'Id', value: value },
          onsubmit: function (e) {
            var id = e.data.id;

            if (!isValidId(id)) {
              e.preventDefault();
              editor.windowManager.alert(
                'Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.'
              );
              return;
            }

            if (isAnchor) {
              selectedNode.removeAttribute('name');
              selectedNode.id = id;
            } else {
              editor.selection.collapse(true);
              editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', {
                id: id
              }));
            }
          }
        });
      };

      if (Env.ceFalse) {
        editor.on('PreInit', function () {
          editor.parser.addNodeFilter('a', setContentEditable('false'));
          editor.serializer.addNodeFilter('a', setContentEditable(null));
        });
      }

      editor.addCommand('mceAnchor', showDialog);

      editor.addButton('anchor', {
        icon: 'anchor',
        tooltip: 'Anchor',
        onclick: showDialog,
        stateSelector: 'a:not([href])'
      });

      editor.addMenuItem('anchor', {
        icon: 'anchor',
        text: 'Anchor',
        context: 'insert',
        onclick: showDialog
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.anchor.Plugin')();
})();

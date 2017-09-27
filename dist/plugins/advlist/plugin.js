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
["tinymce.plugins.advlist.Plugin","tinymce.core.PluginManager","tinymce.core.util.Tools","global!tinymce.util.Tools.resolve"]
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
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Tools',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Tools');
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
 * This class contains all core logic for the advlist plugin.
 *
 * @class tinymce.plugins.advlist.Plugin
 * @private
 */
define(
  'tinymce.plugins.advlist.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.util.Tools'
  ],
  function (PluginManager, Tools) {
    PluginManager.add('advlist', function (editor) {
      var olMenuItems, ulMenuItems;

      var hasPlugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return Tools.inArray(plugins.split(/[ ,]/), plugin) !== -1;
      };

      function isChildOfBody(elm) {
        return editor.$.contains(editor.getBody(), elm);
      }

      function isListNode(node) {
        return node && (/^(OL|UL|DL)$/).test(node.nodeName) && isChildOfBody(node);
      }

      function buildMenuItems(listName, styleValues) {
        var items = [];
        if (styleValues) {
          Tools.each(styleValues.split(/[ ,]/), function (styleValue) {
            items.push({
              text: styleValue.replace(/\-/g, ' ').replace(/\b\w/g, function (chr) {
                return chr.toUpperCase();
              }),
              data: styleValue == 'default' ? '' : styleValue
            });
          });
        }
        return items;
      }

      olMenuItems = buildMenuItems('OL', editor.getParam(
        "advlist_number_styles",
        "default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman"
      ));

      ulMenuItems = buildMenuItems('UL', editor.getParam("advlist_bullet_styles", "default,circle,disc,square"));

      function applyListFormat(listName, styleValue) {
        var cmd = listName == 'UL' ? 'InsertUnorderedList' : 'InsertOrderedList';
        editor.execCommand(cmd, false, styleValue === false ? null : { 'list-style-type': styleValue });
      }

      function updateSelection(e) {
        var listStyleType = editor.dom.getStyle(editor.dom.getParent(editor.selection.getNode(), 'ol,ul'), 'listStyleType') || '';

        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === listStyleType);
        });
      }

      var listState = function (listName) {
        return function () {
          var self = this;

          editor.on('NodeChange', function (e) {
            var lists = Tools.grep(e.parents, isListNode);
            self.active(lists.length > 0 && lists[0].nodeName === listName);
          });
        };
      };

      if (hasPlugin(editor, "lists")) {
        editor.addCommand('ApplyUnorderedListStyle', function (ui, value) {
          applyListFormat('UL', value['list-style-type']);
        });

        editor.addCommand('ApplyOrderedListStyle', function (ui, value) {
          applyListFormat('OL', value['list-style-type']);
        });

        editor.addButton('numlist', {
          type: (olMenuItems.length > 0) ? 'splitbutton' : 'button',
          tooltip: 'Numbered list',
          menu: olMenuItems,
          onPostRender: listState('OL'),
          onshow: updateSelection,
          onselect: function (e) {
            applyListFormat('OL', e.control.settings.data);
          },
          onclick: function () {
            editor.execCommand('InsertOrderedList');
          }
        });

        editor.addButton('bullist', {
          type: (ulMenuItems.length > 0) ? 'splitbutton' : 'button',
          tooltip: 'Bullet list',
          onPostRender: listState('UL'),
          menu: ulMenuItems,
          onshow: updateSelection,
          onselect: function (e) {
            applyListFormat('UL', e.control.settings.data);
          },
          onclick: function () {
            editor.execCommand('InsertUnorderedList');
          }
        });
      }
    });

    return function () { };

  }
);
dem('tinymce.plugins.advlist.Plugin')();
})();

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
    instances[i] = dem(ids[i]);
  callback.apply(null, instances);
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
// this helps with minification when using a lot of global references
var defineGlobal = function (id, ref) {
  define(id, [], function () { return ref; });
};
/*jsc
["tinymce.plugins.colorpicker.Plugin","tinymce.core.PluginManager","tinymce.plugins.colorpicker.ui.Dialog","global!tinymce.util.Tools.resolve","tinymce.core.util.Color"]
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
  'tinymce.core.util.Color',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Color');
  }
);

/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.colorpicker.ui.Dialog',
  [
    'tinymce.core.util.Color'
  ],
  function (Color) {
    var showPreview = function (win, hexColor) {
      win.find('#preview')[0].getEl().style.background = hexColor;
    };

    var setColor = function (win, value) {
      var color = new Color(value), rgb = color.toRgb();

      win.fromJSON({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        hex: color.toHex().substr(1)
      });

      showPreview(win, color.toHex());
    };

    var open = function (editor, callback, value) {
      var win = editor.windowManager.open({
        title: 'Color',
        items: {
          type: 'container',
          layout: 'flex',
          direction: 'row',
          align: 'stretch',
          padding: 5,
          spacing: 10,
          items: [
            {
              type: 'colorpicker',
              value: value,
              onchange: function () {
                var rgb = this.rgb();

                if (win) {
                  win.find('#r').value(rgb.r);
                  win.find('#g').value(rgb.g);
                  win.find('#b').value(rgb.b);
                  win.find('#hex').value(this.value().substr(1));
                  showPreview(win, this.value());
                }
              }
            },
            {
              type: 'form',
              padding: 0,
              labelGap: 5,
              defaults: {
                type: 'textbox',
                size: 7,
                value: '0',
                flex: 1,
                spellcheck: false,
                onchange: function () {
                  var colorPickerCtrl = win.find('colorpicker')[0];
                  var name, value;

                  name = this.name();
                  value = this.value();

                  if (name === "hex") {
                    value = '#' + value;
                    setColor(win, value);
                    colorPickerCtrl.value(value);
                    return;
                  }

                  value = {
                    r: win.find('#r').value(),
                    g: win.find('#g').value(),
                    b: win.find('#b').value()
                  };

                  colorPickerCtrl.value(value);
                  setColor(win, value);
                }
              },
              items: [
                { name: 'r', label: 'R', autofocus: 1 },
                { name: 'g', label: 'G' },
                { name: 'b', label: 'B' },
                { name: 'hex', label: '#', value: '000000' },
                { name: 'preview', type: 'container', border: 1 }
              ]
            }
          ]
        },
        onSubmit: function () {
          callback('#' + win.toJSON().hex);
        }
      });

      setColor(win, value);
    };

    return {
      open: open
    };
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

define(
  'tinymce.plugins.colorpicker.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.colorpicker.ui.Dialog'
  ],
  function (PluginManager, Dialog) {
    PluginManager.add('colorpicker', function (editor) {
      if (!editor.settings.color_picker_callback) {
        editor.settings.color_picker_callback = function (callback, value) {
          Dialog.open(editor, callback, value);
        };
      }
    });

    return function () { };
  }
);
dem('tinymce.plugins.colorpicker.Plugin')();
})();

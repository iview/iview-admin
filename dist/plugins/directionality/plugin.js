(function () {
    var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
    var register_3795 = function (id) {
        var module = dem(id);
        var fragments = id.split('.');
        var target = Function('return this;')();
        for (var i = 0; i < fragments.length - 1; ++i) {
            if (target[fragments[i]] === undefined) { target[fragments[i]] = {}; }
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
        for (var i = 0; i < len; ++i) { instances[i] = dem(dependencies[i]); }
        var defResult = definition.apply(null, instances);
        if (defResult === undefined) { throw 'module [' + id + '] returned undefined'; }
        actual.instance = defResult;
    };

    var def = function (id, dependencies, definition) {
        if (typeof id !== 'string') { throw 'module id must be a string'; } else if (dependencies === undefined) { throw 'no dependencies for ' + id; } else if (definition === undefined) { throw 'no definition function for ' + id; }
        defs[id] = {
            deps: dependencies,
            defn: definition,
            instance: undefined
        };
    };

    var dem = function (id) {
        var actual = defs[id];
        if (actual === undefined) { throw 'module [' + id + '] was undefined'; } else if (actual.instance === undefined) { instantiate(id); }
        return actual.instance;
    };

    var req = function (ids, callback) {
        var len = ids.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(ids[i]); }
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
/* jsc
["tinymce.plugins.directionality.Plugin","tinymce.core.PluginManager","tinymce.plugins.directionality.api.Commands","tinymce.plugins.directionality.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.directionality.core.Direction","tinymce.core.util.Tools"]
jsc */
    defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
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
 * Direction.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.directionality.core.Direction',
        [
            'tinymce.core.util.Tools'
        ],
  function (Tools) {
      var setDir = function (editor, dir) {
          var dom = editor.dom, curDir, blocks = editor.selection.getSelectedBlocks();

          if (blocks.length) {
              curDir = dom.getAttrib(blocks[0], 'dir');

              Tools.each(blocks, function (block) {
          // Add dir to block if the parent block doesn't already have that dir
                  if (!dom.getParent(block.parentNode, '*[dir="' + dir + '"]', dom.getRoot())) {
                      dom.setAttrib(block, 'dir', curDir !== dir ? dir : null);
                  }
              });

              editor.nodeChanged();
          }
      };

      return {
          setDir: setDir
      };
  }
);

/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.directionality.api.Commands',
        [
            'tinymce.plugins.directionality.core.Direction'
        ],
  function (Direction) {
      var register = function (editor) {
          editor.addCommand('mceDirectionLTR', function () {
              Direction.setDir(editor, 'ltr');
          });

          editor.addCommand('mceDirectionRTL', function () {
              Direction.setDir(editor, 'rtl');
          });
      };

      return {
          register: register
      };
  }
);
/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.directionality.ui.Buttons',
        [
            'tinymce.core.util.Tools'
        ],
  function (Tools) {
      var generateSelector = function (dir) {
          var selector = [];

          Tools.each('h1 h2 h3 h4 h5 h6 div p'.split(' '), function (name) {
              selector.push(name + '[dir=' + dir + ']');
          });

          return selector.join(',');
      };

      var register = function (editor) {
          editor.addButton('ltr', {
              title: 'Left to right',
              cmd: 'mceDirectionLTR',
              stateSelector: generateSelector('ltr')
          });

          editor.addButton('rtl', {
              title: 'Right to left',
              cmd: 'mceDirectionRTL',
              stateSelector: generateSelector('rtl')
          });
      };

      return {
          register: register
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
  'tinymce.plugins.directionality.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.directionality.api.Commands',
            'tinymce.plugins.directionality.ui.Buttons'
        ],
  function (PluginManager, Commands, Buttons) {
      PluginManager.add('directionality', function (editor) {
          Commands.register(editor);
          Buttons.register(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.directionality.Plugin')();
})();

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
["tinymce.plugins.nonbreaking.Plugin","tinymce.core.PluginManager","tinymce.plugins.nonbreaking.api.Commands","tinymce.plugins.nonbreaking.core.Keyboard","tinymce.plugins.nonbreaking.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.nonbreaking.core.Actions","tinymce.plugins.nonbreaking.api.Settings"]
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
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.nonbreaking.core.Actions',
        [
        ],
  function () {
      var stringRepeat = function (string, repeats) {
          var str = '';

          for (var index = 0; index < repeats; index++) {
              str += string;
          }

          return str;
      };

      var isVisualCharsEnabled = function (editor) {
          return editor.plugins.visualchars ? editor.plugins.visualchars.isEnabled() : false;
      };

      var insertNbsp = function (editor, times) {
          var nbsp = isVisualCharsEnabled(editor) ? '<span class="mce-nbsp">&nbsp;</span>' : '&nbsp;';

          editor.insertContent(stringRepeat(nbsp, times));
          editor.dom.setAttrib(editor.dom.select('span.mce-nbsp'), 'data-mce-bogus', '1');
      };

      return {
          insertNbsp: insertNbsp
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
  'tinymce.plugins.nonbreaking.api.Commands',
        [
            'tinymce.plugins.nonbreaking.core.Actions'
        ],
  function (Actions) {
      var register = function (editor) {
          editor.addCommand('mceNonBreaking', function () {
              Actions.insertNbsp(editor, 1);
          });
      };

      return {
          register: register
      };
  }
);
/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.nonbreaking.api.Settings',
        [
        ],
  function () {
      var getKeyboardSpaces = function (editor) {
          var spaces = editor.getParam('nonbreaking_force_tab', 0);

          if (typeof tabs === 'boolean') {
              return spaces === true ? 3 : 0;
          } else {
              return spaces;
          }
      };

      return {
          getKeyboardSpaces: getKeyboardSpaces
      };
  }
);

/**
 * Keyboard.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.nonbreaking.core.Keyboard',
        [
            'tinymce.plugins.nonbreaking.api.Settings',
            'tinymce.plugins.nonbreaking.core.Actions'
        ],
  function (Settings, Actions) {
      var setup = function (editor) {
          var spaces = Settings.getKeyboardSpaces(editor);

          if (spaces > 0) {
              editor.on('keydown', function (e) {
                  if (e.keyCode === 9) {
                      if (e.shiftKey) {
                          return;
                      }

                      e.preventDefault();
                      Actions.insertNbsp(editor, spaces);
                  }
              });
          }
      };

      return {
          setup: setup
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
  'tinymce.plugins.nonbreaking.ui.Buttons',
        [
        ],
  function () {
      var register = function (editor) {
          editor.addButton('nonbreaking', {
              title: 'Nonbreaking space',
              cmd: 'mceNonBreaking'
          });

          editor.addMenuItem('nonbreaking', {
              text: 'Nonbreaking space',
              cmd: 'mceNonBreaking',
              context: 'insert'
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

/**
 * This class contains all core logic for the nonbreaking plugin.
 *
 * @class tinymce.nonbreaking.Plugin
 * @private
 */
    define(
  'tinymce.plugins.nonbreaking.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.nonbreaking.api.Commands',
            'tinymce.plugins.nonbreaking.core.Keyboard',
            'tinymce.plugins.nonbreaking.ui.Buttons'
        ],
  function (PluginManager, Commands, Keyboard, Buttons) {
      PluginManager.add('nonbreaking', function (editor) {
          Commands.register(editor);
          Buttons.register(editor);
          Keyboard.setup(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.nonbreaking.Plugin')();
})();

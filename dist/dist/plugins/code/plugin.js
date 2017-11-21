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
["tinymce.plugins.code.Plugin","tinymce.core.PluginManager","tinymce.plugins.code.api.Commands","tinymce.plugins.code.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.code.ui.Dialog","tinymce.plugins.code.api.Settings","tinymce.plugins.code.core.Content","tinymce.core.dom.DOMUtils"]
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
  'tinymce.core.dom.DOMUtils',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.DOMUtils');
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
  'tinymce.plugins.code.api.Settings',
        [
            'tinymce.core.dom.DOMUtils'
        ],
  function (DOMUtils) {
      var getMinWidth = function (editor) {
          return editor.getParam('code_dialog_width', 600);
      };

      var getMinHeight = function (editor) {
          return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
      };

      return {
          getMinWidth: getMinWidth,
          getMinHeight: getMinHeight
      };
  }
);
/**
 * Content.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.code.core.Content',
        [
        ],
  function () {
      var setContent = function (editor, html) {
      // We get a lovely "Wrong document" error in IE 11 if we
      // don't move the focus to the editor before creating an undo
      // transation since it tries to make a bookmark for the current selection
          editor.focus();

          editor.undoManager.transact(function () {
              editor.setContent(html);
          });

          editor.selection.setCursorLocation();
          editor.nodeChanged();
      };

      var getContent = function (editor) {
          return editor.getContent({ source_view: true });
      };

      return {
          setContent: setContent,
          getContent: getContent
      };
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
  'tinymce.plugins.code.ui.Dialog',
        [
            'tinymce.plugins.code.api.Settings',
            'tinymce.plugins.code.core.Content'
        ],
  function (Settings, Content) {
      var open = function (editor) {
          var minWidth = Settings.getMinWidth(editor);
          var minHeight = Settings.getMinHeight(editor);

          var win = editor.windowManager.open({
              title: 'Source code',
              body: {
                  type: 'textbox',
                  name: 'code',
                  multiline: true,
                  minWidth: minWidth,
                  minHeight: minHeight,
                  spellcheck: false,
                  style: 'direction: ltr; text-align: left'
              },
              onSubmit: function (e) {
                  Content.setContent(editor, e.data.code);
              }
          });

      // Gecko has a major performance issue with textarea
      // contents so we need to set it when all reflows are done
          win.find('#code').value(Content.getContent(editor));
      };

      return {
          open: open
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
  'tinymce.plugins.code.api.Commands',
        [
            'tinymce.plugins.code.ui.Dialog'
        ],
  function (Dialog) {
      var register = function (editor) {
          editor.addCommand('mceCodeEditor', function () {
              Dialog.open(editor);
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
  'tinymce.plugins.code.ui.Buttons',
        [
            'tinymce.plugins.code.ui.Dialog'
        ],
  function (Dialog) {
      var register = function (editor) {
          editor.addButton('code', {
              icon: 'code',
              tooltip: 'Source code',
              onclick: function () {
                  Dialog.open(editor);
              }
          });

          editor.addMenuItem('code', {
              icon: 'code',
              text: 'Source code',
              onclick: function () {
                  Dialog.open(editor);
              }
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
  'tinymce.plugins.code.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.code.api.Commands',
            'tinymce.plugins.code.ui.Buttons'
        ],
  function (PluginManager, Commands, Buttons) {
      PluginManager.add('code', function (editor) {
          Commands.register(editor);
          Buttons.register(editor);

          return {};
      });

      return function () { };
  }
);
    dem('tinymce.plugins.code.Plugin')();
})();

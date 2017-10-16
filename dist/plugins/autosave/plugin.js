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
["tinymce.plugins.autosave.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.autosave.api.Api","tinymce.plugins.autosave.core.BeforeUnload","tinymce.plugins.autosave.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.autosave.core.Storage","global!window","tinymce.core.EditorManager","tinymce.core.util.Tools","tinymce.plugins.autosave.api.Settings","global!setInterval","tinymce.core.util.LocalStorage","tinymce.plugins.autosave.api.Events","global!document","tinymce.plugins.autosave.core.Time"]
jsc*/
define(
  'ephox.katamari.api.Cell',

  [
  ],

  function () {
    var Cell = function (initial) {
      var value = initial;

      var get = function () {
        return value;
      };

      var set = function (v) {
        value = v;
      };

      var clone = function () {
        return Cell(get());
      };

      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    return Cell;
  }
);

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

defineGlobal("global!setInterval", setInterval);
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
  'tinymce.core.util.LocalStorage',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.LocalStorage');
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
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.api.Events',
  [
  ],
  function () {
    var fireRestoreDraft = function (editor) {
      return editor.fire('RestoreDraft');
    };

    var fireStoreDraft = function (editor) {
      return editor.fire('StoreDraft');
    };

    var fireRemoveDraft = function (editor) {
      return editor.fire('RemoveDraft');
    };

    return {
      fireRestoreDraft: fireRestoreDraft,
      fireStoreDraft: fireStoreDraft,
      fireRemoveDraft: fireRemoveDraft
    };
  }
);

defineGlobal("global!document", document);
/**
 * Time.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.core.Time',
  [
  ],
  function () {
    var parse = function (time, defaultTime) {
      var multiples = {
        s: 1000,
        m: 60000
      };

      time = /^(\d+)([ms]?)$/.exec('' + (time || defaultTime));

      return (time[2] ? multiples[time[2]] : 1) * parseInt(time, 10);
    };

    return {
      parse: parse
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
  'tinymce.plugins.autosave.api.Settings',
  [
    'global!document',
    'tinymce.plugins.autosave.core.Time'
  ],
  function (document, Time) {
    var shouldAskBeforeUnload = function (editor) {
      return editor.getParam("autosave_ask_before_unload", true);
    };

    var getAutoSavePrefix = function (editor) {
      var prefix = editor.getParam('autosave_prefix', 'tinymce-autosave-{path}{query}-{id}-');

      prefix = prefix.replace(/\{path\}/g, document.location.pathname);
      prefix = prefix.replace(/\{query\}/g, document.location.search);
      prefix = prefix.replace(/\{id\}/g, editor.id);

      return prefix;
    };

    var shouldRestoreWhenEmpty = function (editor) {
      return editor.getParam('autosave_restore_when_empty', false);
    };

    var getAutoSaveInterval = function (editor) {
      return Time.parse(editor.settings.autosave_interval, '30s');
    };

    var getAutoSaveRetention = function (editor) {
      return Time.parse(editor.settings.autosave_retention, '20m');
    };

    return {
      shouldAskBeforeUnload: shouldAskBeforeUnload,
      getAutoSavePrefix: getAutoSavePrefix,
      shouldRestoreWhenEmpty: shouldRestoreWhenEmpty,
      getAutoSaveInterval: getAutoSaveInterval,
      getAutoSaveRetention: getAutoSaveRetention
    };
  }
);
/**
 * Storage.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.core.Storage',
  [
    'global!setInterval',
    'tinymce.core.util.LocalStorage',
    'tinymce.core.util.Tools',
    'tinymce.plugins.autosave.api.Events',
    'tinymce.plugins.autosave.api.Settings'
  ],
  function (setInterval, LocalStorage, Tools, Events, Settings) {
    var isEmpty = function (editor, html) {
      var forcedRootBlockName = editor.settings.forced_root_block;

      html = Tools.trim(typeof html === "undefined" ? editor.getBody().innerHTML : html);

      return html === '' || new RegExp(
        '^<' + forcedRootBlockName + '[^>]*>((\u00a0|&nbsp;|[ \t]|<br[^>]*>)+?|)<\/' + forcedRootBlockName + '>|<br>$', 'i'
      ).test(html);
    };

    var hasDraft = function (editor) {
      var time = parseInt(LocalStorage.getItem(Settings.getAutoSavePrefix(editor) + "time"), 10) || 0;

      if (new Date().getTime() - time > Settings.getAutoSaveRetention(editor)) {
        removeDraft(editor, false);
        return false;
      }

      return true;
    };

    var removeDraft = function (editor, fire) {
      var prefix = Settings.getAutoSavePrefix(editor);

      LocalStorage.removeItem(prefix + "draft");
      LocalStorage.removeItem(prefix + "time");

      if (fire !== false) {
        Events.fireRemoveDraft(editor);
      }
    };

    var storeDraft = function (editor) {
      var prefix = Settings.getAutoSavePrefix(editor);

      if (!isEmpty(editor) && editor.isDirty()) {
        LocalStorage.setItem(prefix + "draft", editor.getContent({ format: 'raw', no_events: true }));
        LocalStorage.setItem(prefix + "time", new Date().getTime());
        Events.fireStoreDraft(editor);
      }
    };

    var restoreDraft = function (editor) {
      var prefix = Settings.getAutoSavePrefix(editor);

      if (hasDraft(editor)) {
        editor.setContent(LocalStorage.getItem(prefix + "draft"), { format: 'raw' });
        Events.fireRestoreDraft(editor);
      }
    };

    var startStoreDraft = function (editor, started) {
      var interval = Settings.getAutoSaveInterval(editor);

      if (!started.get()) {
        setInterval(function () {
          if (!editor.removed) {
            storeDraft(editor);
          }
        }, interval);

        started.set(true);
      }
    };

    var restoreLastDraft = function (editor) {
      editor.undoManager.transact(function () {
        restoreDraft(editor);
        removeDraft(editor);
      });

      editor.focus();
    };

    return {
      isEmpty: isEmpty,
      hasDraft: hasDraft,
      removeDraft: removeDraft,
      storeDraft: storeDraft,
      restoreDraft: restoreDraft,
      startStoreDraft: startStoreDraft,
      restoreLastDraft: restoreLastDraft
    };
  }
);
/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.api.Api',
  [
    'tinymce.plugins.autosave.core.Storage'
  ],
  function (Storage) {
    // Inlined the curry function since adding Fun without tree shaking to every plugin would produce a lot of bloat
    var curry = function (f, editor) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        return f.apply(null, [editor].concat(args));
      };
    };

    var get = function (editor) {
      return {
        hasDraft: curry(Storage.hasDraft, editor),
        storeDraft: curry(Storage.storeDraft, editor),
        restoreDraft: curry(Storage.restoreDraft, editor),
        removeDraft: curry(Storage.removeDraft, editor),
        isEmpty: curry(Storage.isEmpty, editor)
      };
    };

    return {
      get: get
    };
  }
);
defineGlobal("global!window", window);
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
  'tinymce.core.EditorManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.EditorManager');
  }
);

/**
 * BeforeUnload.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.core.BeforeUnload',
  [
    'global!window',
    'tinymce.core.EditorManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.autosave.api.Settings'
  ],
  function (window, EditorManager, Tools, Settings) {
    EditorManager._beforeUnloadHandler = function () {
      var msg;

      Tools.each(EditorManager.get(), function (editor) {
        // Store a draft for each editor instance
        if (editor.plugins.autosave) {
          editor.plugins.autosave.storeDraft();
        }

        // Setup a return message if the editor is dirty
        if (!msg && editor.isDirty() && Settings.shouldAskBeforeUnload(editor)) {
          msg = editor.translate("You have unsaved changes are you sure you want to navigate away?");
        }
      });

      return msg;
    };

    var setup = function (editor) {
      window.onbeforeunload = EditorManager._beforeUnloadHandler;
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
  'tinymce.plugins.autosave.ui.Buttons',
  [
    'tinymce.plugins.autosave.core.Storage'
  ],
  function (Storage) {
    var postRender = function (editor, started) {
      return function (e) {
        var ctrl = e.control;

        ctrl.disabled(!Storage.hasDraft(editor));

        editor.on('StoreDraft RestoreDraft RemoveDraft', function () {
          ctrl.disabled(!Storage.hasDraft(editor));
        });

        // TODO: Investigate why this is only done on postrender that would
        // make the feature broken if only the menu item was rendered since
        // it is rendered when the menu appears
        Storage.startStoreDraft(editor, started);
      };
    };

    var register = function (editor, started) {
      editor.addButton('restoredraft', {
        title: 'Restore last draft',
        onclick: function () {
          Storage.restoreLastDraft(editor);
        },
        onPostRender: postRender(editor, started)
      });

      editor.addMenuItem('restoredraft', {
        text: 'Restore last draft',
        onclick: function () {
          Storage.restoreLastDraft(editor);
        },
        onPostRender: postRender(editor, started),
        context: 'file'
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
 * This class contains all core logic for the autosave plugin.
 *
 * @class tinymce.autosave.Plugin
 * @private
 */
define(
  'tinymce.plugins.autosave.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.autosave.api.Api',
    'tinymce.plugins.autosave.core.BeforeUnload',
    'tinymce.plugins.autosave.ui.Buttons'
  ],
  function (Cell, PluginManager, Api, BeforeUnload, Buttons) {
    PluginManager.add('autosave', function (editor) {
      var started = Cell(false);

      BeforeUnload.setup(editor);
      Buttons.register(editor, started);

      return Api.get(editor);
    });

    return function () { };
  }
);
dem('tinymce.plugins.autosave.Plugin')();
})();

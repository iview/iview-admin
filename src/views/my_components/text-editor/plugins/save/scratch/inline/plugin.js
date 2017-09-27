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
["0","1","2","3","4","5","6","7","8","9"]
jsc*/
defineGlobal("4", tinymce.util.Tools.resolve);
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
  "1",
  [
    "4"
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
  "7",
  [
    "4"
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
  "8",
  [
    "4"
  ],
  function (resolve) {
    return resolve('tinymce.EditorManager');
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
  "9",
  [
    "4"
  ],
  function (resolve) {
    return resolve('tinymce.util.Tools');
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
  "6",
  [
  ],
  function () {
    var enableWhenDirty = function (editor) {
      return editor.getParam('save_enablewhendirty', true);
    };

    var hasOnSaveCallback = function (editor) {
      return !!editor.getParam('save_onsavecallback');
    };

    var hasOnCancelCallback = function (editor) {
      return !!editor.getParam('save_oncancelcallback');
    };

    return {
      enableWhenDirty: enableWhenDirty,
      hasOnSaveCallback: hasOnSaveCallback,
      hasOnCancelCallback: hasOnCancelCallback
    };
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
  "5",
  [
    "7",
    "8",
    "9",
    "6"
  ],
  function (DOMUtils, EditorManager, Tools, Settings) {
    var displayErrorMessage = function (editor, message) {
      editor.notificationManager.open({
        text: editor.translate(message),
        type: 'error'
      });
    };

    var save = function (editor) {
      var formObj;

      formObj = DOMUtils.DOM.getParent(editor.id, 'form');

      if (Settings.enableWhenDirty(editor) && !editor.isDirty()) {
        return;
      }

      // TODO: This should only save the specific editor not all editors
      EditorManager.triggerSave();

      // Use callback instead
      if (Settings.hasOnSaveCallback(editor)) {
        editor.execCallback('save_onsavecallback', editor);
        editor.nodeChanged();
        return;
      }

      if (formObj) {
        editor.setDirty(false);

        if (!formObj.onsubmit || formObj.onsubmit()) {
          if (typeof formObj.submit === 'function') {
            formObj.submit();
          } else {
            displayErrorMessage(editor, 'Error: Form submit field collision.');
          }
        }

        editor.nodeChanged();
      } else {
        displayErrorMessage(editor, 'Error: No form element found.');
      }
    };

    var cancel = function (editor) {
      var h = Tools.trim(editor.startContent);

      // Use callback instead
      if (Settings.hasOnCancelCallback(editor)) {
        editor.execCallback('save_oncancelcallback', editor);
        return;
      }

      editor.setContent(h);
      editor.undoManager.clear();
      editor.nodeChanged();
    };

    return {
      save: save,
      cancel: cancel
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
  "2",
  [
    "5"
  ],
  function (Actions) {
    var register = function (editor) {
      editor.addCommand('mceSave', function () {
        Actions.save(editor);
      });

      editor.addCommand('mceCancel', function () {
        Actions.cancel(editor);
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
  "3",
  [
    "6"
  ],
  function (Settings) {
    var stateToggle = function (editor) {
      return function (e) {
        var ctrl = e.control;

        editor.on('nodeChange dirty', function () {
          ctrl.disabled(Settings.enableWhenDirty(editor) && !editor.isDirty());
        });
      };
    };

    var register = function (editor) {
      editor.addButton('save', {
        icon: 'save',
        text: 'Save',
        cmd: 'mceSave',
        disabled: true,
        onPostRender: stateToggle(editor)
      });

      editor.addButton('cancel', {
        text: 'Cancel',
        icon: false,
        cmd: 'mceCancel',
        disabled: true,
        onPostRender: stateToggle(editor)
      });

      editor.addShortcut('Meta+S', '', 'mceSave');
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
  "0",
  [
    "1",
    "2",
    "3"
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('save', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
    });

    return function () { };
  }
);
dem("0")();
})();

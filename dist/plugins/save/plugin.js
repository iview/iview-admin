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
["tinymce.plugins.save.Plugin","tinymce.core.PluginManager","tinymce.core.dom.DOMUtils","tinymce.core.EditorManager","tinymce.core.util.Tools","global!tinymce.util.Tools.resolve"]
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
  'tinymce.core.EditorManager',
  [
    'global!tinymce.util.Tools.resolve'
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
 * This class contains all core logic for the save plugin.
 *
 * @class tinymce.save.Plugin
 * @private
 */
define(
  'tinymce.plugins.save.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.EditorManager',
    'tinymce.core.util.Tools'
  ],
  function (PluginManager, DOMUtils, EditorManager, Tools) {
    PluginManager.add('save', function (editor) {
      function save() {
        var formObj;

        formObj = DOMUtils.DOM.getParent(editor.id, 'form');

        if (editor.getParam("save_enablewhendirty", true) && !editor.isDirty()) {
          return;
        }

        EditorManager.triggerSave();

        // Use callback instead
        if (editor.getParam("save_onsavecallback")) {
          editor.execCallback('save_onsavecallback', editor);
          editor.nodeChanged();
          return;
        }

        if (formObj) {
          editor.setDirty(false);

          if (!formObj.onsubmit || formObj.onsubmit()) {
            if (typeof formObj.submit == "function") {
              formObj.submit();
            } else {
              displayErrorMessage(editor.translate("Error: Form submit field collision."));
            }
          }

          editor.nodeChanged();
        } else {
          displayErrorMessage(editor.translate("Error: No form element found."));
        }
      }

      function displayErrorMessage(message) {
        editor.notificationManager.open({
          text: message,
          type: 'error'
        });
      }

      function cancel() {
        var h = Tools.trim(editor.startContent);

        // Use callback instead
        if (editor.getParam("save_oncancelcallback")) {
          editor.execCallback('save_oncancelcallback', editor);
          return;
        }

        editor.setContent(h);
        editor.undoManager.clear();
        editor.nodeChanged();
      }

      function stateToggle() {
        var self = this;

        editor.on('nodeChange dirty', function () {
          self.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
        });
      }

      editor.addCommand('mceSave', save);
      editor.addCommand('mceCancel', cancel);

      editor.addButton('save', {
        icon: 'save',
        text: 'Save',
        cmd: 'mceSave',
        disabled: true,
        onPostRender: stateToggle
      });

      editor.addButton('cancel', {
        text: 'Cancel',
        icon: false,
        cmd: 'mceCancel',
        disabled: true,
        onPostRender: stateToggle
      });

      editor.addShortcut('Meta+S', '', 'mceSave');
    });

    return function () { };
  }
);
dem('tinymce.plugins.save.Plugin')();
})();

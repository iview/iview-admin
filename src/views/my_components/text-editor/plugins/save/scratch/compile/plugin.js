/*jsc
["tinymce.plugins.save.Plugin","tinymce.core.PluginManager","tinymce.plugins.save.api.Commands","tinymce.plugins.save.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.save.core.Actions","tinymce.plugins.save.api.Settings","tinymce.core.dom.DOMUtils","tinymce.core.EditorManager","tinymce.core.util.Tools"]
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
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.save.api.Settings',
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
  'tinymce.plugins.save.core.Actions',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.EditorManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.save.api.Settings'
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
  'tinymce.plugins.save.api.Commands',
  [
    'tinymce.plugins.save.core.Actions'
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
  'tinymce.plugins.save.ui.Buttons',
  [
    'tinymce.plugins.save.api.Settings'
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
  'tinymce.plugins.save.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.save.api.Commands',
    'tinymce.plugins.save.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('save', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
    });

    return function () { };
  }
);
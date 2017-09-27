/*jsc
["tinymce.plugins.code.Plugin","tinymce.core.PluginManager","tinymce.plugins.code.api.Commands","tinymce.plugins.code.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.code.ui.Dialog","tinymce.plugins.code.api.Settings","tinymce.plugins.code.core.Content","tinymce.core.dom.DOMUtils"]
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
        context: 'tools',
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
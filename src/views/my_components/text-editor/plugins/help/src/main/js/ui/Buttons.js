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
  'tinymce.plugins.help.ui.Buttons',
  [
    'tinymce.plugins.help.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor, pluginUrl) {
      editor.addButton('help', {
        icon: 'help',
        onclick: Dialog.open(editor, pluginUrl)
      });

      editor.addMenuItem('Help', {
        text: 'Help',
        icon: 'help',
        context: 'view',
        onclick: Dialog.open(editor, pluginUrl)
      });
    };

    return {
      register: register
    };
  }
);

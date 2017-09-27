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
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
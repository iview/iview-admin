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
  'tinymce.plugins.visualchars.core.Keyboard',
  [
    'tinymce.core.util.Delay',
    'tinymce.plugins.visualchars.core.VisualChars'
  ],
  function (Delay, VisualChars) {
    var setup = function (editor, toggleState) {
      var debouncedToggle = Delay.debounce(function () {
        VisualChars.toggle(editor);
      }, 300);

      if (editor.settings.forced_root_block !== false) {
        editor.on('keydown', function (e) {
          if (toggleState.get() === true) {
            e.keyCode === 13 ? VisualChars.toggle(editor) : debouncedToggle();
          }
        });
      }
    };

    return {
      setup: setup
    };
  }
);
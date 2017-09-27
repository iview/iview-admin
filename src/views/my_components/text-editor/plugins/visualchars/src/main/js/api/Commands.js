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
  'tinymce.plugins.visualchars.api.Commands',
  [
    'tinymce.plugins.visualchars.core.Actions'
  ],
  function (Actions) {
    var register = function (editor, toggleState) {
      editor.addCommand('mceVisualChars', function () {
        Actions.toggleVisualChars(editor, toggleState);
      });
    };

    return {
      register: register
    };
  }
);
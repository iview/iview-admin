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
  'tinymce.plugins.link.core.Keyboard',
  [
    'tinymce.plugins.link.core.Actions'
  ],
  function (Actions) {
    var setup = function (editor) {
      editor.addShortcut('Meta+K', '', Actions.openDialog(editor));
    };

    return {
      setup: setup
    };
  }
);

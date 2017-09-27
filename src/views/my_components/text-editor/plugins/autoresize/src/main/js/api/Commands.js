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
  'tinymce.plugins.autoresize.api.Commands',
  [
    'tinymce.plugins.autoresize.core.Resize'
  ],
  function (Resize) {
    var register = function (editor, oldSize) {
      editor.addCommand('mceAutoResize', function () {
        Resize.resize(editor, oldSize);
      });
    };

    return {
      register: register
    };
  }
);
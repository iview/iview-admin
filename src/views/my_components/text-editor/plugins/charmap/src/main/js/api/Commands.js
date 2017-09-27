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
  'tinymce.plugins.charmap.api.Commands',
  [
    'tinymce.plugins.charmap.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor) {
      editor.addCommand('mceShowCharmap', function () {
        Dialog.open(editor);
      });
    };

    return {
      register: register
    };
  }
);
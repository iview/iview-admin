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
  'tinymce.plugins.searchreplace.api.Commands',
  [
    'tinymce.plugins.searchreplace.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor, currentIndexState) {
      editor.addCommand('SearchReplace', function () {
        Dialog.open(editor, currentIndexState);
      });
    };

    return {
      register: register
    };
  }
);
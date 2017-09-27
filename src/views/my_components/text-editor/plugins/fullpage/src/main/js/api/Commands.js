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
  'tinymce.plugins.fullpage.api.Commands',
  [
    'tinymce.plugins.fullpage.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor, headState) {
      editor.addCommand('mceFullPageProperties', function () {
        Dialog.open(editor, headState);
      });
    };

    return {
      register: register
    };
  }
);
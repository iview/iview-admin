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
  'tinymce.plugins.nonbreaking.api.Commands',
  [
    'tinymce.plugins.nonbreaking.core.Actions'
  ],
  function (Actions) {
    var register = function (editor) {
      editor.addCommand('mceNonBreaking', function () {
        Actions.insertNbsp(editor, 1);
      });
    };

    return {
      register: register
    };
  }
);
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
  'tinymce.plugins.save.api.Commands',
  [
    'tinymce.plugins.save.core.Actions'
  ],
  function (Actions) {
    var register = function (editor) {
      editor.addCommand('mceSave', function () {
        Actions.save(editor);
      });

      editor.addCommand('mceCancel', function () {
        Actions.cancel(editor);
      });
    };

    return {
      register: register
    };
  }
);
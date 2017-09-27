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
  'tinymce.plugins.codesample.api.Commands',
  [
    'tinymce.plugins.codesample.ui.Dialog',
    'tinymce.plugins.codesample.util.Utils'
  ],
  function (Dialog, Utils) {
    var register = function (editor) {
      editor.addCommand('codesample', function () {
        var node = editor.selection.getNode();
        if (editor.selection.isCollapsed() || Utils.isCodeSample(node)) {
          Dialog.open(editor);
        } else {
          editor.formatter.toggle('code');
        }
      });
    };

    return {
      register: register
    };
  }
);
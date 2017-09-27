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
  'tinymce.plugins.directionality.api.Commands',
  [
    'tinymce.plugins.directionality.core.Direction'
  ],
  function (Direction) {
    var register = function (editor) {
      editor.addCommand('mceDirectionLTR', function () {
        Direction.setDir(editor, 'ltr');
      });

      editor.addCommand('mceDirectionRTL', function () {
        Direction.setDir(editor, 'rtl');
      });
    };

    return {
      register: register
    };
  }
);
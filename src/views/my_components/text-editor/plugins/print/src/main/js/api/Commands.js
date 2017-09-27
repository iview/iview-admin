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
  'tinymce.plugins.print.api.Commands',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addCommand('mcePrint', function () {
        editor.getWin().print();
      });
    };

    return {
      register: register
    };
  }
);
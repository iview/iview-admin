/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.print.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('print', {
        title: 'Print',
        cmd: 'mcePrint'
      });
    };

    return {
      register: register
    };
  }
);
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
  'tinymce.plugins.nonbreaking.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('nonbreaking', {
        title: 'Nonbreaking space',
        cmd: 'mceNonBreaking'
      });

      editor.addMenuItem('nonbreaking', {
        text: 'Nonbreaking space',
        cmd: 'mceNonBreaking',
        context: 'insert'
      });
    };

    return {
      register: register
    };
  }
);
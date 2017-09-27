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
  'tinymce.plugins.preview.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('preview', {
        title: 'Preview',
        cmd: 'mcePreview'
      });

      editor.addMenuItem('preview', {
        text: 'Preview',
        cmd: 'mcePreview',
        context: 'view'
      });
    };

    return {
      register: register
    };
  }
);
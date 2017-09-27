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
  'tinymce.plugins.fullpage.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('fullpage', {
        title: 'Document properties',
        cmd: 'mceFullPageProperties'
      });

      editor.addMenuItem('fullpage', {
        text: 'Document properties',
        cmd: 'mceFullPageProperties',
        context: 'file'
      });
    };

    return {
      register: register
    };
  }
);
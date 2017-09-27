/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.nonbreaking.core.Actions',
  [
  ],
  function () {
    var stringRepeat = function (string, repeats) {
      var str = '';

      for (var index = 0; index < repeats; index++) {
        str += string;
      }

      return str;
    };

    var isVisualCharsEnabled = function (editor) {
      return editor.plugins.visualchars ? editor.plugins.visualchars.isEnabled() : false;
    };

    var insertNbsp = function (editor, times) {
      var nbsp = isVisualCharsEnabled(editor) ? '<span class="mce-nbsp">&nbsp;</span>' : '&nbsp;';

      editor.insertContent(stringRepeat(nbsp, times));
      editor.dom.setAttrib(editor.dom.select('span.mce-nbsp'), 'data-mce-bogus', '1');
    };

    return {
      insertNbsp: insertNbsp
    };
  }
);
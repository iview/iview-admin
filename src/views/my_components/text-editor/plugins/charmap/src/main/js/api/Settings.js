/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.charmap.api.Settings',
  [
  ],
  function () {
    var getCharMap = function (editor) {
      return editor.settings.charmap;
    };

    var getCharMapAppend = function (editor) {
      return editor.settings.charmap_append;
    };

    return {
      getCharMap: getCharMap,
      getCharMapAppend: getCharMapAppend
    };
  }
);
/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.charmap.api.Api',
  [
    'tinymce.plugins.charmap.core.Actions',
    'tinymce.plugins.charmap.core.CharMap'
  ],
  function (Actions, CharMap) {
    var get = function (editor) {
      var getCharMap = function () {
        return CharMap.getCharMap(editor);
      };

      var insertChar = function (chr) {
        Actions.insertChar(editor, chr);
      };

      return {
        getCharMap: getCharMap,
        insertChar: insertChar
      };
    };

    return {
      get: get
    };
  }
);


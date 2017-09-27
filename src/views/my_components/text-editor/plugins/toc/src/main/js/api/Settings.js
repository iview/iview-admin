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
  'tinymce.plugins.toc.api.Settings',
  [
  ],
  function () {
    var getTocClass = function (editor) {
      return editor.getParam('toc_class', 'mce-toc');
    };

    var getTocHeader = function (editor) {
      var tagName = editor.getParam('toc_header', 'h2');
      var isValid = tagName ? editor.schema.isValidChild('div', tagName) : false;
      return isValid ? tagName : 'h2';
    };

    var getTocDepth = function (editor) {
      var depth = parseInt(editor.getParam('toc_depth', '3'), 10);
      return depth >= 1 && depth <= 9 ? depth : 3;
    };

    return {
      getTocClass: getTocClass,
      getTocHeader: getTocHeader,
      getTocDepth: getTocDepth
    };
  }
);

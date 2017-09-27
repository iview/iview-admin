/**
 * WordCount.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.text.WordCount',
  [
    'tinymce.plugins.wordcount.text.WordGetter'
  ],
  function (WordGetter) {
    var getTextContent = function (editor) {
      return editor.removed ? '' : editor.getBody().innerText;
    };

    var getCount = function (editor) {
      return WordGetter.getWords(getTextContent(editor)).length;
    };

    return {
      getCount: getCount
    };
  }
);

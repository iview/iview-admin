/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.api.Api',
  [
    'tinymce.plugins.wordcount.text.WordCount'
  ],
  function (WordCount) {
    var get = function (editor) {
      var getCount = function () {
        return WordCount.getCount(editor);
      };

      return {
        getCount: getCount
      };
    };

    return {
      get: get
    };
  }
);

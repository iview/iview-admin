/**
 * Html.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualchars.core.Html',
  [
    'tinymce.plugins.visualchars.core.Data'
  ],
  function (Data) {
    var wrapCharWithSpan = function (value) {
      return '<span data-mce-bogus="1" class="mce-' + Data.charMap[value] + '">' + value + '</span>';
    };

    return {
      wrapCharWithSpan: wrapCharWithSpan
    };
  }
);

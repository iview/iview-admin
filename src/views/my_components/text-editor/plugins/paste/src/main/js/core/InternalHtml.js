/**
 * InternalHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.core.InternalHtml',
  [
  ],
  function () {
    var internalMimeType = 'x-tinymce/html';
    var internalMark = '<!-- ' + internalMimeType + ' -->';

    var mark = function (html) {
      return internalMark + html;
    };

    var unmark = function (html) {
      return html.replace(internalMark, '');
    };

    var isMarked = function (html) {
      return html.indexOf(internalMark) !== -1;
    };

    return {
      mark: mark,
      unmark: unmark,
      isMarked: isMarked,
      internalHtmlMime: function () {
        return internalMimeType;
      }
    };
  }
);
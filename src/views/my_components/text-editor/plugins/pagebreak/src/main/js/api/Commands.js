/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.pagebreak.api.Commands',
  [
    'tinymce.plugins.pagebreak.core.FilterContent'
  ],
  function (FilterContent) {
    var register = function (editor) {
      editor.addCommand('mcePageBreak', function () {
        if (editor.settings.pagebreak_split_block) {
          editor.insertContent('<p>' + FilterContent.getPlaceholderHtml() + '</p>');
        } else {
          editor.insertContent(FilterContent.getPlaceholderHtml());
        }
      });
    };

    return {
      register: register
    };
  }
);
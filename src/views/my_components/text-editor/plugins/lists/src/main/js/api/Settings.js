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
  'tinymce.plugins.lists.api.Settings',
  [
  ],
  function () {
    var shouldIndentOnTab = function (editor) {
      return editor.getParam('lists_indent_on_tab', true);
    };

    return {
      shouldIndentOnTab: shouldIndentOnTab
    };
  }
);


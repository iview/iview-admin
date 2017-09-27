/**
 * Content.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.code.core.Content',
  [
  ],
  function () {
    var setContent = function (editor, html) {
      // We get a lovely "Wrong document" error in IE 11 if we
      // don't move the focus to the editor before creating an undo
      // transation since it tries to make a bookmark for the current selection
      editor.focus();

      editor.undoManager.transact(function () {
        editor.setContent(html);
      });

      editor.selection.setCursorLocation();
      editor.nodeChanged();
    };

    var getContent = function (editor) {
      return editor.getContent({ source_view: true });
    };

    return {
      setContent: setContent,
      getContent: getContent
    };
  }
);
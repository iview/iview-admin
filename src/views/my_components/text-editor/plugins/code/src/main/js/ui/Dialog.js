/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.code.ui.Dialog',
  [
    'tinymce.plugins.code.api.Settings',
    'tinymce.plugins.code.core.Content'
  ],
  function (Settings, Content) {
    var open = function (editor) {
      var minWidth = Settings.getMinWidth(editor);
      var minHeight = Settings.getMinHeight(editor);

      var win = editor.windowManager.open({
        title: 'Source code',
        body: {
          type: 'textbox',
          name: 'code',
          multiline: true,
          minWidth: minWidth,
          minHeight: minHeight,
          spellcheck: false,
          style: 'direction: ltr; text-align: left'
        },
        onSubmit: function (e) {
          Content.setContent(editor, e.data.code);
        }
      });

      // Gecko has a major performance issue with textarea
      // contents so we need to set it when all reflows are done
      win.find('#code').value(Content.getContent(editor));
    };

    return {
      open: open
    };
  }
);
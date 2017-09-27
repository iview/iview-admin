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
  'tinymce.plugins.anchor.ui.Dialog',
  [
    'tinymce.plugins.anchor.core.Anchor'
  ],
  function (Anchor) {
    var insertAnchor = function (editor, newId) {
      if (!Anchor.isValidId(newId)) {
        editor.windowManager.alert(
          'Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.'
        );
        return true;
      } else {
        Anchor.insert(editor, newId);
        return false;
      }
    };

    var open = function (editor) {
      var currentId = Anchor.getId(editor);

      editor.windowManager.open({
        title: 'Anchor',
        body: { type: 'textbox', name: 'id', size: 40, label: 'Id', value: currentId },
        onsubmit: function (e) {
          var newId = e.data.id;

          if (insertAnchor(editor, newId)) {
            e.preventDefault();
          }
        }
      });
    };

    return {
      open: open
    };
  }
);
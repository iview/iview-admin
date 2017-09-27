/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.searchreplace.ui.Buttons',
  [
    'tinymce.plugins.searchreplace.ui.Dialog'
  ],
  function (Dialog) {
    var showDialog = function (editor, currentIndexState) {
      return function () {
        Dialog.open(editor, currentIndexState);
      };
    };

    var register = function (editor, currentIndexState) {
      editor.addMenuItem('searchreplace', {
        text: 'Find and replace',
        shortcut: 'Meta+F',
        onclick: showDialog(editor, currentIndexState),
        separator: 'before',
        context: 'edit'
      });

      editor.addButton('searchreplace', {
        tooltip: 'Find and replace',
        shortcut: 'Meta+F',
        onclick: showDialog(editor, currentIndexState)
      });

      editor.shortcuts.add('Meta+F', '', showDialog(editor, currentIndexState));
    };

    return {
      register: register
    };
  }
);
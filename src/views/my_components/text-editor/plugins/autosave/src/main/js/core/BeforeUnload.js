/**
 * BeforeUnload.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.core.BeforeUnload',
  [
    'global!window',
    'tinymce.core.EditorManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.autosave.api.Settings'
  ],
  function (window, EditorManager, Tools, Settings) {
    EditorManager._beforeUnloadHandler = function () {
      var msg;

      Tools.each(EditorManager.get(), function (editor) {
        // Store a draft for each editor instance
        if (editor.plugins.autosave) {
          editor.plugins.autosave.storeDraft();
        }

        // Setup a return message if the editor is dirty
        if (!msg && editor.isDirty() && Settings.shouldAskBeforeUnload(editor)) {
          msg = editor.translate("You have unsaved changes are you sure you want to navigate away?");
        }
      });

      return msg;
    };

    var setup = function (editor) {
      window.onbeforeunload = EditorManager._beforeUnloadHandler;
    };

    return {
      setup: setup
    };
  }
);
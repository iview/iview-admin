/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.save.core.Actions',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.EditorManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.save.api.Settings'
  ],
  function (DOMUtils, EditorManager, Tools, Settings) {
    var displayErrorMessage = function (editor, message) {
      editor.notificationManager.open({
        text: editor.translate(message),
        type: 'error'
      });
    };

    var save = function (editor) {
      var formObj;

      formObj = DOMUtils.DOM.getParent(editor.id, 'form');

      if (Settings.enableWhenDirty(editor) && !editor.isDirty()) {
        return;
      }

      // TODO: This should only save the specific editor not all editors
      EditorManager.triggerSave();

      // Use callback instead
      if (Settings.hasOnSaveCallback(editor)) {
        editor.execCallback('save_onsavecallback', editor);
        editor.nodeChanged();
        return;
      }

      if (formObj) {
        editor.setDirty(false);

        if (!formObj.onsubmit || formObj.onsubmit()) {
          if (typeof formObj.submit === 'function') {
            formObj.submit();
          } else {
            displayErrorMessage(editor, 'Error: Form submit field collision.');
          }
        }

        editor.nodeChanged();
      } else {
        displayErrorMessage(editor, 'Error: No form element found.');
      }
    };

    var cancel = function (editor) {
      var h = Tools.trim(editor.startContent);

      // Use callback instead
      if (Settings.hasOnCancelCallback(editor)) {
        editor.execCallback('save_oncancelcallback', editor);
        return;
      }

      editor.setContent(h);
      editor.undoManager.clear();
      editor.nodeChanged();
    };

    return {
      save: save,
      cancel: cancel
    };
  }
);
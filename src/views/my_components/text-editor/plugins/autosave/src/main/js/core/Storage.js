/**
 * Storage.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autosave.core.Storage',
  [
    'global!setInterval',
    'tinymce.core.util.LocalStorage',
    'tinymce.core.util.Tools',
    'tinymce.plugins.autosave.api.Events',
    'tinymce.plugins.autosave.api.Settings'
  ],
  function (setInterval, LocalStorage, Tools, Events, Settings) {
    var isEmpty = function (editor, html) {
      var forcedRootBlockName = editor.settings.forced_root_block;

      html = Tools.trim(typeof html === "undefined" ? editor.getBody().innerHTML : html);

      return html === '' || new RegExp(
        '^<' + forcedRootBlockName + '[^>]*>((\u00a0|&nbsp;|[ \t]|<br[^>]*>)+?|)<\/' + forcedRootBlockName + '>|<br>$', 'i'
      ).test(html);
    };

    var hasDraft = function (editor) {
      var time = parseInt(LocalStorage.getItem(Settings.getAutoSavePrefix(editor) + "time"), 10) || 0;

      if (new Date().getTime() - time > Settings.getAutoSaveRetention(editor)) {
        removeDraft(editor, false);
        return false;
      }

      return true;
    };

    var removeDraft = function (editor, fire) {
      var prefix = Settings.getAutoSavePrefix(editor);

      LocalStorage.removeItem(prefix + "draft");
      LocalStorage.removeItem(prefix + "time");

      if (fire !== false) {
        Events.fireRemoveDraft(editor);
      }
    };

    var storeDraft = function (editor) {
      var prefix = Settings.getAutoSavePrefix(editor);

      if (!isEmpty(editor) && editor.isDirty()) {
        LocalStorage.setItem(prefix + "draft", editor.getContent({ format: 'raw', no_events: true }));
        LocalStorage.setItem(prefix + "time", new Date().getTime());
        Events.fireStoreDraft(editor);
      }
    };

    var restoreDraft = function (editor) {
      var prefix = Settings.getAutoSavePrefix(editor);

      if (hasDraft(editor)) {
        editor.setContent(LocalStorage.getItem(prefix + "draft"), { format: 'raw' });
        Events.fireRestoreDraft(editor);
      }
    };

    var startStoreDraft = function (editor, started) {
      var interval = Settings.getAutoSaveInterval(editor);

      if (!started.get()) {
        setInterval(function () {
          if (!editor.removed) {
            storeDraft(editor);
          }
        }, interval);

        started.set(true);
      }
    };

    var restoreLastDraft = function (editor) {
      editor.undoManager.transact(function () {
        restoreDraft(editor);
        removeDraft(editor);
      });

      editor.focus();
    };

    return {
      isEmpty: isEmpty,
      hasDraft: hasDraft,
      removeDraft: removeDraft,
      storeDraft: storeDraft,
      restoreDraft: restoreDraft,
      startStoreDraft: startStoreDraft,
      restoreLastDraft: restoreLastDraft
    };
  }
);
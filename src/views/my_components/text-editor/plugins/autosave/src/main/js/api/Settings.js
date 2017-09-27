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
  'tinymce.plugins.autosave.api.Settings',
  [
    'global!document',
    'tinymce.plugins.autosave.core.Time'
  ],
  function (document, Time) {
    var shouldAskBeforeUnload = function (editor) {
      return editor.getParam("autosave_ask_before_unload", true);
    };

    var getAutoSavePrefix = function (editor) {
      var prefix = editor.getParam('autosave_prefix', 'tinymce-autosave-{path}{query}-{id}-');

      prefix = prefix.replace(/\{path\}/g, document.location.pathname);
      prefix = prefix.replace(/\{query\}/g, document.location.search);
      prefix = prefix.replace(/\{id\}/g, editor.id);

      return prefix;
    };

    var shouldRestoreWhenEmpty = function (editor) {
      return editor.getParam('autosave_restore_when_empty', false);
    };

    var getAutoSaveInterval = function (editor) {
      return Time.parse(editor.settings.autosave_interval, '30s');
    };

    var getAutoSaveRetention = function (editor) {
      return Time.parse(editor.settings.autosave_retention, '20m');
    };

    return {
      shouldAskBeforeUnload: shouldAskBeforeUnload,
      getAutoSavePrefix: getAutoSavePrefix,
      shouldRestoreWhenEmpty: shouldRestoreWhenEmpty,
      getAutoSaveInterval: getAutoSaveInterval,
      getAutoSaveRetention: getAutoSaveRetention
    };
  }
);
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
  'tinymce.plugins.save.api.Settings',
  [
  ],
  function () {
    var enableWhenDirty = function (editor) {
      return editor.getParam('save_enablewhendirty', true);
    };

    var hasOnSaveCallback = function (editor) {
      return !!editor.getParam('save_onsavecallback');
    };

    var hasOnCancelCallback = function (editor) {
      return !!editor.getParam('save_oncancelcallback');
    };

    return {
      enableWhenDirty: enableWhenDirty,
      hasOnSaveCallback: hasOnSaveCallback,
      hasOnCancelCallback: hasOnCancelCallback
    };
  }
);
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
  'tinymce.plugins.preview.api.Settings',
  [
  ],
  function () {
    var getPreviewDialogWidth = function (editor) {
      return parseInt(editor.getParam('plugin_preview_width', '650'), 10);
    };

    var getPreviewDialogHeight = function (editor) {
      return parseInt(editor.getParam('plugin_preview_height', '500'), 10);
    };

    return {
      getPreviewDialogWidth: getPreviewDialogWidth,
      getPreviewDialogHeight: getPreviewDialogHeight
    };
  }
);
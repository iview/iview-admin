/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.api.Api',
  [
    'tinymce.plugins.media.ui.Dialog'
  ],
  function (Dialog) {
    var get = function (editor) {
      var showDialog = function () {
        Dialog.showDialog(editor);
      };

      return {
        showDialog: showDialog
      };
    };

    return {
      get: get
    };
  }
);


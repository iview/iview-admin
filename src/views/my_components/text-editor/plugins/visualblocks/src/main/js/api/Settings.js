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
  'tinymce.plugins.visualblocks.api.Settings',
  [
  ],
  function () {
    var isEnabledByDefault = function (editor) {
      return editor.getParam('visualblocks_default_state', false);
    };

    var getContentCss = function (editor) {
      return editor.settings.visualblocks_content_css;
    };

    return {
      isEnabledByDefault: isEnabledByDefault,
      getContentCss: getContentCss
    };
  }
);
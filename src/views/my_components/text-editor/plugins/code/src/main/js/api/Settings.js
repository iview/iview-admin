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
  'tinymce.plugins.code.api.Settings',
  [
    'tinymce.core.dom.DOMUtils'
  ],
  function (DOMUtils) {
    var getMinWidth = function (editor) {
      return editor.getParam('code_dialog_width', 600);
    };

    var getMinHeight = function (editor) {
      return editor.getParam('code_dialog_height', Math.min(DOMUtils.DOM.getViewPort().h - 200, 500));
    };

    return {
      getMinWidth: getMinWidth,
      getMinHeight: getMinHeight
    };
  }
);
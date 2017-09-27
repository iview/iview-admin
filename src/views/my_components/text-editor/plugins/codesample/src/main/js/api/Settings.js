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
  'tinymce.plugins.codesample.api.Settings',
  [
    'tinymce.core.dom.DOMUtils'
  ],
  function (DOMUtils) {
    var getContentCss = function (editor) {
      return editor.settings.codesample_content_css;
    };

    var getLanguages = function (editor) {
      return editor.settings.codesample_languages;
    };

    var getDialogMinWidth = function (editor) {
      return Math.min(DOMUtils.DOM.getViewPort().w, editor.getParam('codesample_dialog_width', 800));
    };

    var getDialogMinHeight = function (editor) {
      return Math.min(DOMUtils.DOM.getViewPort().w, editor.getParam('codesample_dialog_height', 650));
    };

    return {
      getContentCss: getContentCss,
      getLanguages: getLanguages,
      getDialogMinWidth: getDialogMinWidth,
      getDialogMinHeight: getDialogMinHeight
    };
  }
);
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
  'tinymce.plugins.autoresize.api.Settings',
  [
  ],
  function () {
    var getAutoResizeMinHeight = function (editor) {
      return parseInt(editor.getParam('autoresize_min_height', editor.getElement().offsetHeight), 10);
    };

    var getAutoResizeMaxHeight = function (editor) {
      return parseInt(editor.getParam('autoresize_max_height', 0), 10);
    };

    var getAutoResizeOverflowPadding = function (editor) {
      return editor.getParam('autoresize_overflow_padding', 1);
    };

    var getAutoResizeBottomMargin = function (editor) {
      return editor.getParam('autoresize_bottom_margin', 50);
    };

    var shouldAutoResizeOnInit = function (editor) {
      return editor.getParam('autoresize_on_init', true);
    };

    return {
      getAutoResizeMinHeight: getAutoResizeMinHeight,
      getAutoResizeMaxHeight: getAutoResizeMaxHeight,
      getAutoResizeOverflowPadding: getAutoResizeOverflowPadding,
      getAutoResizeBottomMargin: getAutoResizeBottomMargin,
      shouldAutoResizeOnInit: shouldAutoResizeOnInit
    };
  }
);
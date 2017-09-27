/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.api.Events',
  [
  ],
  function () {
    var fireSkinLoaded = function (editor) {
      return editor.fire('SkinLoaded');
    };

    var fireResizeEditor = function (editor) {
      return editor.fire('ResizeEditor');
    };

    var fireBeforeRenderUI = function (editor) {
      return editor.fire('BeforeRenderUI');
    };

    return {
      fireSkinLoaded: fireSkinLoaded,
      fireResizeEditor: fireResizeEditor,
      fireBeforeRenderUI: fireBeforeRenderUI
    };
  }
);

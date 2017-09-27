/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.api.Events',
  [
  ],
  function () {
    var fireFullscreenStateChanged = function (editor, state) {
      editor.fire('FullscreenStateChanged', { state: state });
    };

    return {
      fireFullscreenStateChanged: fireFullscreenStateChanged
    };
  }
);

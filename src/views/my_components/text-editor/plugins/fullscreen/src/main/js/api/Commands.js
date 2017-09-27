/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.api.Commands',
  [
    'tinymce.plugins.fullscreen.core.Actions'
  ],
  function (Actions) {
    var register = function (editor, fullscreenState) {
      editor.addCommand('mceFullScreen', function () {
        fullscreenState.set(Actions.toggleFullscreen(editor, fullscreenState.get()));
      });
    };

    return {
      register: register
    };
  }
);

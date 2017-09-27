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
  'tinymce.plugins.imagetools.api.Commands',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.imagetools.core.Actions'
  ],
  function (Tools, Actions) {
    var register = function (editor, imageUploadTimerState) {
      Tools.each({
        mceImageRotateLeft: Actions.rotate(editor, imageUploadTimerState, -90),
        mceImageRotateRight: Actions.rotate(editor, imageUploadTimerState, 90),
        mceImageFlipVertical: Actions.flip(editor, imageUploadTimerState, 'v'),
        mceImageFlipHorizontal: Actions.flip(editor, imageUploadTimerState, 'h'),
        mceEditImage: Actions.editImageDialog(editor, imageUploadTimerState)
      }, function (fn, cmd) {
        editor.addCommand(cmd, fn);
      });
    };

    return {
      register: register
    };
  }
);

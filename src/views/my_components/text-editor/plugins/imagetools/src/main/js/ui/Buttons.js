/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('rotateleft', {
        title: 'Rotate counterclockwise',
        cmd: 'mceImageRotateLeft'
      });

      editor.addButton('rotateright', {
        title: 'Rotate clockwise',
        cmd: 'mceImageRotateRight'
      });

      editor.addButton('flipv', {
        title: 'Flip vertically',
        cmd: 'mceImageFlipVertical'
      });

      editor.addButton('fliph', {
        title: 'Flip horizontally',
        cmd: 'mceImageFlipHorizontal'
      });

      editor.addButton('editimage', {
        title: 'Edit image',
        cmd: 'mceEditImage'
      });

      editor.addButton('imageoptions', {
        title: 'Image options',
        icon: 'options',
        cmd: 'mceImage'
      });
    };

    return {
      register: register
    };
  }
);

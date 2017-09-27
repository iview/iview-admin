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
  'tinymce.plugins.fullscreen.ui.Buttons',
  [
  ],
  function () {
    var postRender = function (editor) {
      return function (e) {
        var ctrl = e.control;

        editor.on('FullscreenStateChanged', function (e) {
          ctrl.active(e.state);
        });
      };
    };

    var register = function (editor) {
      editor.addMenuItem('fullscreen', {
        text: 'Fullscreen',
        shortcut: 'Ctrl+Shift+F',
        selectable: true,
        cmd: 'mceFullScreen',
        onPostRender: postRender(editor),
        context: 'view'
      });

      editor.addButton('fullscreen', {
        tooltip: 'Fullscreen',
        shortcut: 'Ctrl+Shift+F',
        cmd: 'mceFullScreen',
        onPostRender: postRender(editor)
      });
    };

    return {
      register: register
    };
  }
);
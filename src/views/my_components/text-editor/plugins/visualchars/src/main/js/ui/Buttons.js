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
  'tinymce.plugins.visualchars.ui.Buttons',
  [
  ],
  function () {
    var toggleActiveState = function (editor) {
      return function (e) {
        var ctrl = e.control;

        editor.on('VisualChars', function (e) {
          ctrl.active(e.state);
        });
      };
    };

    var register = function (editor) {
      editor.addButton('visualchars', {
        title: 'Show invisible characters',
        cmd: 'mceVisualChars',
        onPostRender: toggleActiveState(editor)
      });

      editor.addMenuItem('visualchars', {
        text: 'Show invisible characters',
        cmd: 'mceVisualChars',
        onPostRender: toggleActiveState(editor),
        selectable: true,
        context: 'view',
        prependToContext: true
      });
    };

    return {
      register: register
    };
  }
);
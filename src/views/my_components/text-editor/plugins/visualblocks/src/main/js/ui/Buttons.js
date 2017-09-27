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
  'tinymce.plugins.visualblocks.ui.Buttons',
  [
    'tinymce.plugins.visualblocks.core.VisualBlocks'
  ],
  function (VisualBlocks) {
    var toggleActiveState = function (editor) {
      return function (e) {
        var ctrl = e.control;

        ctrl.active(VisualBlocks.isEnabled(editor));

        editor.on('VisualBlocks', function (e) {
          ctrl.active(e.state);
        });
      };
    };

    var register = function (editor) {
      editor.addButton('visualblocks', {
        title: 'Show blocks',
        cmd: 'mceVisualBlocks',
        onPostRender: toggleActiveState(editor)
      });

      editor.addMenuItem('visualblocks', {
        text: 'Show blocks',
        cmd: 'mceVisualBlocks',
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
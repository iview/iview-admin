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
  'tinymce.plugins.paste.ui.Buttons',
  [
    'ephox.katamari.api.Fun'
  ],
  function (Fun) {
    var stateChange = function (editor, clipboard, e) {
      var ctrl = e.control;

      ctrl.active(clipboard.pasteFormat === 'text');

      editor.on('PastePlainTextToggle', function (e) {
        ctrl.active(e.state);
      });
    };

    var register = function (editor, clipboard) {
      var postRender = Fun.curry(stateChange, editor, clipboard);

      editor.addButton('pastetext', {
        icon: 'pastetext',
        tooltip: 'Paste as text',
        cmd: 'mceTogglePlainTextPaste',
        onPostRender: postRender
      });

      editor.addMenuItem('pastetext', {
        text: 'Paste as text',
        selectable: true,
        active: clipboard.pasteFormat,
        cmd: 'mceTogglePlainTextPaste',
        onPostRender: postRender
      });
    };

    return {
      register: register
    };
  }
);
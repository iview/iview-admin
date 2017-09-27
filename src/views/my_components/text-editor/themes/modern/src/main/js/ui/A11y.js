/**
 * A11y.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.A11y',
  [
  ],
  function () {
    var focus = function (panel, type) {
      return function () {
        var item = panel.find(type)[0];

        if (item) {
          item.focus(true);
        }
      };
    };

    var addKeys = function (editor, panel) {
      editor.shortcuts.add('Alt+F9', '', focus(panel, 'menubar'));
      editor.shortcuts.add('Alt+F10,F10', '', focus(panel, 'toolbar'));
      editor.shortcuts.add('Alt+F11', '', focus(panel, 'elementpath'));
      panel.on('cancel', function () {
        editor.focus();
      });
    };

    return {
      addKeys: addKeys
    };
  }
);

/**
 * ProgressState.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.ProgressState',
  [
    'tinymce.ui.Throbber'
  ],
  function (Throbber) {
    var setup = function (editor, theme) {
      var throbber;

      editor.on('ProgressState', function (e) {
        throbber = throbber || new Throbber(theme.panel.getEl('body'));

        if (e.state) {
          throbber.show(e.time);
        } else {
          throbber.hide();
        }
      });
    };

    return {
      setup: setup
    };
  }
);

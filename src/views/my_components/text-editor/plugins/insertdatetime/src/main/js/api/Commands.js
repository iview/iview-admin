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
  'tinymce.plugins.insertdatetime.api.Commands',
  [
    'tinymce.plugins.fullpage.api.Settings',
    'tinymce.plugins.insertdatetime.core.Actions'
  ],
  function (Settings, Actions) {
    var register = function (editor) {
      editor.addCommand('mceInsertDate', function () {
        Actions.insertDateTime(editor, Settings.getDateFormat());
      });

      editor.addCommand('mceInsertTime', function () {
        Actions.insertDateTime(editor, Settings.getTimeFormat());
      });
    };

    return {
      register: register
    };
  }
);


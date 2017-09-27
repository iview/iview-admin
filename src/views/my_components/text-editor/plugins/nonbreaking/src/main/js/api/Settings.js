/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.nonbreaking.api.Settings',
  [
  ],
  function () {
    var getKeyboardSpaces = function (editor) {
      var spaces = editor.getParam('nonbreaking_force_tab', 0);

      if (typeof tabs === 'boolean') {
        return spaces === true ? 3 : 0;
      } else {
        return spaces;
      }
    };

    return {
      getKeyboardSpaces: getKeyboardSpaces
    };
  }
);

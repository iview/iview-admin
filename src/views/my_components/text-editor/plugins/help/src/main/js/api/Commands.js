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
  'tinymce.plugins.help.api.Commands',
  [
    'tinymce.plugins.help.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor, pluginUrl) {
      editor.addCommand('mceHelp', Dialog.open(editor, pluginUrl));
    };

    return {
      register: register
    };
  }
);



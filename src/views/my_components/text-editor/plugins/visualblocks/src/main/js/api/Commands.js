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
  'tinymce.plugins.visualblocks.api.Commands',
  [
    'tinymce.plugins.visualblocks.core.VisualBlocks'
  ],
  function (VisualBlocks) {
    var register = function (editor, pluginUrl) {
      editor.addCommand('mceVisualBlocks', function () {
        VisualBlocks.toggleVisualBlocks(editor, pluginUrl);
      });
    };

    return {
      register: register
    };
  }
);
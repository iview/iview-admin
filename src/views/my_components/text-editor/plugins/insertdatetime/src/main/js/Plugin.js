/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.insertdatetime.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.insertdatetime.api.Commands',
    'tinymce.plugins.insertdatetime.ui.Buttons'
  ],
  function (Cell, PluginManager, Commands, Buttons) {
    PluginManager.add('insertdatetime', function (editor) {
      var lastFormatState = Cell(null);

      Commands.register(editor);
      Buttons.register(editor, lastFormatState);
    });

    return function () { };
  }
);
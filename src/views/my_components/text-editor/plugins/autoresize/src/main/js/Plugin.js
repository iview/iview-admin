/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the autoresize plugin.
 *
 * @class tinymce.autoresize.Plugin
 * @private
 */
define(
  'tinymce.plugins.autoresize.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.autoresize.api.Commands',
    'tinymce.plugins.autoresize.core.Resize'
  ],
  function (Cell, PluginManager, Commands, Resize) {
    PluginManager.add('autoresize', function (editor) {
      if (!editor.inline) {
        var oldSize = Cell(0);
        Commands.register(editor, oldSize);
        Resize.setup(editor, oldSize);
      }
    });

    return function () {};
  }
);
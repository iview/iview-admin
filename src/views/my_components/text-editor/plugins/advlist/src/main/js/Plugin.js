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
  'tinymce.plugins.advlist.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.advlist.api.Commands',
    'tinymce.plugins.advlist.ui.Buttons'
  ],
  function (PluginManager, Tools, Commands, Buttons) {
    PluginManager.add('advlist', function (editor) {
      var hasPlugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return Tools.inArray(plugins.split(/[ ,]/), plugin) !== -1;
      };

      if (hasPlugin(editor, "lists")) {
        Buttons.register(editor);
        Commands.register(editor);
      }
    });

    return function () { };
  }
);
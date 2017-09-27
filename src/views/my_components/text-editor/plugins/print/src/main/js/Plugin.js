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
  'tinymce.plugins.print.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.print.api.Commands',
    'tinymce.plugins.print.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('print', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      editor.addShortcut('Meta+P', '', 'mcePrint');
    });

    return function () { };
  }
);
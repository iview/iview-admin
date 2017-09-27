/**
 * PLugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.help.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.help.api.Commands',
    'tinymce.plugins.help.ui.Buttons',
    'tinymce.plugins.help.ui.Dialog'
  ],
  function (PluginManager, Commands, Buttons, Dialog) {
    PluginManager.add('help', function (editor, pluginUrl) {
      Buttons.register(editor, pluginUrl);
      Commands.register(editor, pluginUrl);
      editor.shortcuts.add('Alt+0', 'Open help dialog', 'mceHelp');
    });

    return function () {};
  }
);

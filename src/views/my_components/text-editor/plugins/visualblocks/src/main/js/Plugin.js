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
  'tinymce.plugins.visualblocks.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.visualblocks.api.Commands',
    'tinymce.plugins.visualblocks.core.Bindings',
    'tinymce.plugins.visualblocks.ui.Buttons'
  ],
  function (PluginManager, Commands, Bindings, Buttons) {
    PluginManager.add('visualblocks', function (editor, pluginUrl) {
      Commands.register(editor, pluginUrl);
      Buttons.register(editor);
      Bindings.setup(editor, pluginUrl);
    });

    return function () { };
  }
);
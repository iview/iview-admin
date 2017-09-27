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
  'tinymce.plugins.code.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.code.api.Commands',
    'tinymce.plugins.code.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('code', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);

      return {};
    });

    return function () { };
  }
);
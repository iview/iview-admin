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
  'tinymce.plugins.preview.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.preview.api.Commands',
    'tinymce.plugins.preview.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('preview', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
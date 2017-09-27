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
  'tinymce.plugins.save.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.save.api.Commands',
    'tinymce.plugins.save.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('save', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
    });

    return function () { };
  }
);
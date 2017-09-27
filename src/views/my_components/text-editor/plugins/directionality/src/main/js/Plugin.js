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
  'tinymce.plugins.directionality.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.directionality.api.Commands',
    'tinymce.plugins.directionality.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('directionality', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
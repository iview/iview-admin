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
  'tinymce.plugins.hr.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.hr.api.Commands',
    'tinymce.plugins.hr.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('hr', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
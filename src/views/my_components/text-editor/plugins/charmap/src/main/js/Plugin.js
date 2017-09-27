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
  'tinymce.plugins.charmap.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.charmap.api.Api',
    'tinymce.plugins.charmap.api.Commands',
    'tinymce.plugins.charmap.ui.Buttons'
  ],
  function (PluginManager, Api, Commands, Buttons) {
    PluginManager.add('charmap', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);

      return Api.get(editor);
    });

    return function () { };
  }
);
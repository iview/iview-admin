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
  'tinymce.plugins.lists.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.lists.api.Api',
    'tinymce.plugins.lists.api.Commands',
    'tinymce.plugins.lists.core.Keyboard',
    'tinymce.plugins.lists.ui.Buttons'
  ],
  function (PluginManager, Api, Commands, Keyboard, Buttons) {
    PluginManager.add('lists', function (editor) {
      Keyboard.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);

      return Api.get(editor);
    });

    return function () { };
  }
);


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
  'tinymce.plugins.image.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.image.api.Commands',
    'tinymce.plugins.image.core.FilterContent',
    'tinymce.plugins.image.ui.Buttons'
  ],
  function (PluginManager, Commands, FilterContent, Buttons) {
    PluginManager.add('image', function (editor) {
      FilterContent.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);
    });

    return function () { };
  }
);
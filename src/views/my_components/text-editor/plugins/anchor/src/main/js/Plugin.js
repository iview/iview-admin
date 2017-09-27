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
  'tinymce.plugins.anchor.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.anchor.api.Commands',
    'tinymce.plugins.anchor.core.FilterContent',
    'tinymce.plugins.anchor.ui.Buttons'
  ],
  function (PluginManager, Commands, FilterContent, Buttons) {
    PluginManager.add('anchor', function (editor) {
      FilterContent.setup(editor);
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
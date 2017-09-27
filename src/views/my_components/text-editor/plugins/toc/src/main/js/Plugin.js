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
  'tinymce.plugins.toc.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.toc.api.Commands',
    'tinymce.plugins.toc.api.Settings',
    'tinymce.plugins.toc.core.FilterContent',
    'tinymce.plugins.toc.ui.Buttons'
  ],
  function (PluginManager, Commands, Settings, FilterContent, Buttons) {
    PluginManager.add('toc', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      FilterContent.setup(editor);
    });

    return function () { };
  }
);
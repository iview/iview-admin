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
  'tinymce.plugins.pagebreak.Plugin',
  [
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.plugins.pagebreak.api.Commands',
    'tinymce.plugins.pagebreak.core.FilterContent',
    'tinymce.plugins.pagebreak.core.ResolveName',
    'tinymce.plugins.pagebreak.ui.Buttons'
  ],
  function (Env, PluginManager, Commands, FilterContent, ResolveName, Buttons) {
    PluginManager.add('pagebreak', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      FilterContent.setup(editor);
      ResolveName.setup(editor);
    });

    return function () { };
  }
);
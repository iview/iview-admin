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
  'tinymce.plugins.template.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.template.api.Commands',
    'tinymce.plugins.template.core.FilterContent',
    'tinymce.plugins.template.ui.Buttons'
  ],
  function (PluginManager, Commands, FilterContent, Buttons) {
    PluginManager.add('template', function (editor) {
      Buttons.register(editor);
      Commands.register(editor);
      FilterContent.setup(editor);
    });

    return function () { };
  }
);
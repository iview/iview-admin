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
  'tinymce.plugins.media.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.media.api.Api',
    'tinymce.plugins.media.api.Commands',
    'tinymce.plugins.media.core.FilterContent',
    'tinymce.plugins.media.core.ResolveName',
    'tinymce.plugins.media.core.Selection',
    'tinymce.plugins.media.ui.Buttons'
  ],
  function (PluginManager, Api, Commands, FilterContent, ResolveName, Selection, Buttons) {
    PluginManager.add('media', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      ResolveName.setup(editor);
      FilterContent.setup(editor);
      Selection.setup(editor);
      return Api.get(editor);
    });

    return function () { };
  }
);


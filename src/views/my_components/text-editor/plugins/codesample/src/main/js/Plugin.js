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
  'tinymce.plugins.codesample.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.codesample.api.Commands',
    'tinymce.plugins.codesample.core.FilterContent',
    'tinymce.plugins.codesample.core.LoadCss',
    'tinymce.plugins.codesample.ui.Buttons'
  ],
  function (Cell, PluginManager, Commands, FilterContent, LoadCss, Buttons) {
    var addedInlineCss = Cell(false);

    PluginManager.add('codesample', function (editor, pluginUrl) {
      var addedCss = Cell(false);

      FilterContent.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);

      editor.on('init', function () {
        LoadCss.loadCss(editor, pluginUrl, addedInlineCss, addedCss);
      });
    });

    return function () { };
  }
);
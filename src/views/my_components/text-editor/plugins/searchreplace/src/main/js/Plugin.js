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
  'tinymce.plugins.searchreplace.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.searchreplace.api.Api',
    'tinymce.plugins.searchreplace.api.Commands',
    'tinymce.plugins.searchreplace.ui.Buttons'
  ],
  function (Cell, PluginManager, Api, Commands, Buttons) {
    PluginManager.add('searchreplace', function (editor) {
      var currentIndexState = Cell(-1);

      Commands.register(editor, currentIndexState);
      Buttons.register(editor, currentIndexState);

      return Api.get(editor, currentIndexState);
    });

    return function () { };
  }
);
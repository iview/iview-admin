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
  'tinymce.plugins.fullscreen.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.fullscreen.api.Api',
    'tinymce.plugins.fullscreen.api.Commands',
    'tinymce.plugins.fullscreen.ui.Buttons'
  ],
  function (Cell, PluginManager, Api, Commands, Buttons) {
    PluginManager.add('fullscreen', function (editor) {
      var fullscreenState = Cell(null);

      Commands.register(editor, fullscreenState);
      Buttons.register(editor);

      editor.addShortcut('Ctrl+Shift+F', '', 'mceFullScreen');

      return Api.get(fullscreenState);
    });

    return function () { };
  }
);
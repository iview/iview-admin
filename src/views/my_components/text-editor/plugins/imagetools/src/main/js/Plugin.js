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
  'tinymce.plugins.imagetools.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.imagetools.api.Commands',
    'tinymce.plugins.imagetools.core.UploadSelectedImage',
    'tinymce.plugins.imagetools.ui.Buttons',
    'tinymce.plugins.imagetools.ui.ContextToolbar'
  ],
  function (Cell, PluginManager, Commands, UploadSelectedImage, Buttons, ContextToolbar) {
    PluginManager.add('imagetools', function (editor) {
      var imageUploadTimerState = Cell(0);
      var lastSelectedImageState = Cell(null);

      Commands.register(editor, imageUploadTimerState);
      Buttons.register(editor);
      ContextToolbar.register(editor);

      UploadSelectedImage.setup(editor, imageUploadTimerState, lastSelectedImageState);
    });

    return function () { };
  }
);

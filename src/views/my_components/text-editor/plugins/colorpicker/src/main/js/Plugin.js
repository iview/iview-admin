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
  'tinymce.plugins.colorpicker.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.colorpicker.ui.Dialog'
  ],
  function (PluginManager, Dialog) {
    PluginManager.add('colorpicker', function (editor) {
      if (!editor.settings.color_picker_callback) {
        editor.settings.color_picker_callback = function (callback, value) {
          Dialog.open(editor, callback, value);
        };
      }
    });

    return function () { };
  }
);
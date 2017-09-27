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
  'tinymce.plugins.paste.core.PrePostProcess',
  [
    'tinymce.plugins.paste.api.Settings'
  ],
  function (Settings) {
    var setup = function (editor) {
      var plugin = editor.plugins.paste;

      var preProcess = Settings.getPreProcess(editor);
      if (preProcess) {
        editor.on('PastePreProcess', function (e) {
          preProcess.call(plugin, plugin, e);
        });
      }

      var postProcess = Settings.getPostProcess(editor);
      if (postProcess) {
        editor.on('PastePostProcess', function (e) {
          postProcess.call(plugin, plugin, e);
        });
      }
    };

    return {
      setup: setup
    };
  }
);

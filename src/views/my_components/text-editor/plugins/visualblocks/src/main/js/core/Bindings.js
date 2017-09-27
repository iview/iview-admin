/**
 * Bindings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualblocks.core.Bindings',
  [
    'tinymce.plugins.visualblocks.api.Settings',
    'tinymce.plugins.visualblocks.core.VisualBlocks'
  ],
  function (Settings, VisualBlocks) {
    var setup = function (editor, pluginUrl) {
      editor.on('PreviewFormats AfterPreviewFormats', function (e) {
        if (VisualBlocks.isEnabled(editor)) {
          editor.dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type === 'afterpreviewformats');
        }
      });

      editor.on('init', function () {
        if (Settings.isEnabledByDefault(editor)) {
          VisualBlocks.toggleVisualBlocks(editor, pluginUrl);
        }
      });

      editor.on('remove', function () {
        editor.dom.removeClass(editor.getBody(), 'mce-visualblocks');
      });
    };

    return {
      setup: setup
    };
  }
);
/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the legacyoutput plugin.
 *
 * @class tinymce.legacyoutput.Plugin
 * @private
 */
define(
  'tinymce.plugins.legacyoutput.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.legacyoutput.core.Formats',
    'tinymce.plugins.legacyoutput.ui.Buttons'
  ],
  function (PluginManager, Formats, Buttons) {
    PluginManager.add('legacyoutput', function (editor) {
      Formats.setup(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
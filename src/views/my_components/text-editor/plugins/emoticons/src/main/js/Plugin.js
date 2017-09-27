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
 * This class contains all core logic for the emoticons plugin.
 *
 * @class tinymce.emoticons.Plugin
 * @private
 */
define(
  'tinymce.plugins.emoticons.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.emoticons.ui.Buttons'
  ],
  function (PluginManager, Buttons) {
    PluginManager.add('emoticons', function (editor, pluginUrl) {
      Buttons.register(editor, pluginUrl);
    });

    return function () { };
  }
);
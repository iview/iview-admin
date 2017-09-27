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
 * This class contains all core logic for the nonbreaking plugin.
 *
 * @class tinymce.nonbreaking.Plugin
 * @private
 */
define(
  'tinymce.plugins.nonbreaking.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.nonbreaking.api.Commands',
    'tinymce.plugins.nonbreaking.core.Keyboard',
    'tinymce.plugins.nonbreaking.ui.Buttons'
  ],
  function (PluginManager, Commands, Keyboard, Buttons) {
    PluginManager.add('nonbreaking', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
      Keyboard.setup(editor);
    });

    return function () { };
  }
);
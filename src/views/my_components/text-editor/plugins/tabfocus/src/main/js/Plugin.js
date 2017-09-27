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
  'tinymce.plugins.tabfocus.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.tabfocus.core.Keyboard'
  ],
  function (PluginManager, Keyboard) {
    PluginManager.add('tabfocus', function (editor) {
      Keyboard.setup(editor);
    });

    return function () { };
  }
);
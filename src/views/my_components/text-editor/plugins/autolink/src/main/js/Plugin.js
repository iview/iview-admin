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
  'tinymce.plugins.autolink.Plugin',
  [
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.plugins.autolink.core.Keys'
  ],
  function (Env, PluginManager, Keys) {
    PluginManager.add('autolink', function (editor) {
      Keys.setup(editor);
    });

    return function () { };
  }
);
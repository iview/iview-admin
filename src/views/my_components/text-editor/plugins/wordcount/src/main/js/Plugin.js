/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.wordcount.api.Api',
    'tinymce.plugins.wordcount.ui.Statusbar'
  ],
  function (PluginManager, Api, Statusbar) {
    PluginManager.add('wordcount', function (editor) {
      Statusbar.setup(editor);
      return Api.get(editor);
    });

    return function () { };
  }
);

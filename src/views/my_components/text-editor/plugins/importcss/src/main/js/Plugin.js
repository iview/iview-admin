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
  'tinymce.plugins.importcss.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.importcss.api.Api',
    'tinymce.plugins.importcss.core.ImportCss'
  ],
  function (PluginManager, Api, ImportCss) {
    PluginManager.add('importcss', function (editor) {
      ImportCss.setup(editor);
      return Api.get(editor);
    });

    return function () { };
  }
);
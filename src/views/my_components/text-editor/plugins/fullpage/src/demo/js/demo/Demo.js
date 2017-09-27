/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.plugins.fullpage.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.fullpage.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, FullPagePlugin, ModernTheme) {
    return function () {
      CodePlugin();
      FullPagePlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "fullpage code",
        toolbar: "fullpage code",
        height: 600
      });
    };
  }
);
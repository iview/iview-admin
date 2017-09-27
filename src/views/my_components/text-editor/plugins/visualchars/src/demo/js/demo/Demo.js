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
  'tinymce.plugins.visualchars.demo.Demo',

  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.visualchars.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, VisualCharsPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      VisualCharsPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "visualchars code",
        toolbar: "visualchars code",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        height: 600
      });
    };
  }
);
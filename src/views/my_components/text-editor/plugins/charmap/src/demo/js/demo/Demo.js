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
  'tinymce.plugins.charmap.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.charmap.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CharMapPlugin, CodePlugin, ModernTheme) {
    return function () {
      CharMapPlugin();
      CodePlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "charmap code",
        toolbar: "charmap code",
        height: 600
      });
    };
  }
);